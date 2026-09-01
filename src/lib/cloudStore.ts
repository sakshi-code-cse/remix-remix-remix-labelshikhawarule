import { db, doc, setDoc, getDoc, onSnapshot, collection, getDocs, deleteDoc } from './firebase';
import { 
  Product, 
  AdminOrder, 
  AdminAppointment, 
  PromoCode, 
  ClientDiary, 
  HeroCMSContent, 
  BrandStoryCMSContent, 
  StoreSettingsCMSContent, 
  LogoCMSContent, 
  StyleCategory, 
  CategoryItem, 
  DiscoveryStory,
  MediaAsset 
} from '../types';

export interface AppDatabaseState {
  products: Product[];
  orders: AdminOrder[];
  appointments: AdminAppointment[];
  promoCodes: PromoCode[];
  clientDiaries: ClientDiary[];
  announcementText: string;
  heroCMS: HeroCMSContent;
  brandStoryCMS: BrandStoryCMSContent;
  storeSettingsCMS: StoreSettingsCMSContent;
  logoCMS: LogoCMSContent;
  stylesList: StyleCategory[];
  categoriesList: CategoryItem[];
  discoveryStories: DiscoveryStory[];
  mediaAssets?: MediaAsset[];
  lastUpdated?: string;
}

const STORE_CONFIG_DOC = 'main_store_data';
const MEDIA_COLLECTION = 'media_assets';

// Helper to sanitize large or undefined data before saving
function sanitizeForFirestore<T>(data: T, keyName?: string): T {
  const cloned = JSON.parse(JSON.stringify(data));
  if (keyName === 'discoveryStories' && Array.isArray(cloned)) {
    return cloned.map((story: any) => {
      if (story && typeof story.videoUrl === 'string' && story.videoUrl.startsWith('data:video/')) {
        return {
          ...story,
          videoUrl: '', // Large video file is saved in IndexedDB
          hasLocalVideo: true,
        };
      }
      return story;
    }) as unknown as T;
  }
  return cloned;
}

/**
 * Save specific key or full store state to cloud Firestore
 * Saves to its own dedicated document (e.g. 'store_settings/clientDiaries') to eliminate the 1MB limit
 * and also merges into 'main_store_data' for backward compatibility.
 */
export async function saveToCloudDatabase<K extends keyof AppDatabaseState>(
  key: K,
  value: AppDatabaseState[K]
): Promise<void> {
  const sanitized = sanitizeForFirestore(value, key as string);
  const now = new Date().toISOString();

  // 1. Save to dedicated collection document for this key (giving full 1MB budget per feature)
  try {
    const sectionDocRef = doc(db, 'store_settings', key);
    await setDoc(
      sectionDocRef,
      {
        value: sanitized,
        lastUpdated: now,
      },
      { merge: true }
    );
  } catch (err) {
    console.warn(`Warning saving individual document for ${key}:`, err);
  }

  // 2. Also update main_store_data
  try {
    const mainDocRef = doc(db, 'store_settings', STORE_CONFIG_DOC);
    await setDoc(
      mainDocRef,
      {
        [key]: sanitized,
        lastUpdated: now,
      },
      { merge: true }
    );
  } catch (error) {
    console.warn(`Notice updating main_store_data for ${key} (item saved in dedicated document):`, error);
  }
}

/**
 * Save full store snapshot to cloud Firestore
 */
export async function saveFullStoreSnapshot(state: Partial<AppDatabaseState>): Promise<void> {
  const now = new Date().toISOString();

  // Save individual keys first
  const entries = Object.entries(state) as [keyof AppDatabaseState, any][];
  for (const [k, v] of entries) {
    if (v !== undefined && k !== 'lastUpdated') {
      try {
        const secRef = doc(db, 'store_settings', k);
        await setDoc(secRef, { value: sanitizeForFirestore(v), lastUpdated: now }, { merge: true });
      } catch (e) {
        console.warn(`Snapshot key save warning for ${k}:`, e);
      }
    }
  }

  // Also update main config
  try {
    const docRef = doc(db, 'store_settings', STORE_CONFIG_DOC);
    await setDoc(
      docRef,
      {
        ...sanitizeForFirestore(state),
        lastUpdated: now,
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Notice saving store snapshot to main_store_data:', error);
  }
}

/**
 * Fetch initial cloud state once, combining individual key documents with main_store_data
 */
export async function fetchCloudStoreData(): Promise<Partial<AppDatabaseState> | null> {
  try {
    const result: Partial<AppDatabaseState> = {};
    let foundAny = false;

    // 1. Fetch main_store_data if available
    try {
      const docRef = doc(db, 'store_settings', STORE_CONFIG_DOC);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as Partial<AppDatabaseState>;
        Object.assign(result, data);
        foundAny = true;
      }
    } catch (e) {
      console.warn('Error reading main_store_data:', e);
    }

    // 2. Fetch all individual collection documents to override with newest partitioned data
    try {
      const colRef = collection(db, 'store_settings');
      const querySnap = await getDocs(colRef);
      querySnap.forEach((d) => {
        if (d.id !== STORE_CONFIG_DOC) {
          const docData = d.data();
          if (docData && 'value' in docData) {
            const key = d.id as keyof AppDatabaseState;
            (result as any)[key] = docData.value;
            foundAny = true;
          }
        }
      });
    } catch (e) {
      console.warn('Error reading partitioned store_settings docs:', e);
    }

    return foundAny ? result : null;
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
    return null;
  }
}

/**
 * Real-time subscription to cloud changes across devices/tabs
 */
export function subscribeToCloudStoreData(
  onData: (data: Partial<AppDatabaseState>) => void,
  onError?: (error: unknown) => void
): () => void {
  try {
    const colRef = collection(db, 'store_settings');
    const unsubscribe = onSnapshot(
      colRef,
      (querySnapshot) => {
        const aggregated: Partial<AppDatabaseState> = {};
        let mainData: Partial<AppDatabaseState> = {};

        querySnapshot.forEach((docSnap) => {
          if (docSnap.id === STORE_CONFIG_DOC) {
            mainData = docSnap.data() as Partial<AppDatabaseState>;
          } else {
            const d = docSnap.data();
            if (d && 'value' in d) {
              const k = docSnap.id as keyof AppDatabaseState;
              (aggregated as any)[k] = d.value;
            }
          }
        });

        // Merge individual overrides over main_store_data
        const finalData = { ...mainData, ...aggregated };
        if (Object.keys(finalData).length > 0) {
          onData(finalData);
        }
      },
      (err) => {
        console.warn('Firestore live subscription notice:', err);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error('Failed to setup Firestore onSnapshot:', err);
    return () => {};
  }
}

/**
 * MEDIA LIBRARY CLOUD METHODS
 */
export async function saveMediaAssetToCloud(asset: MediaAsset): Promise<void> {
  try {
    const docRef = doc(db, MEDIA_COLLECTION, asset.id);
    await setDoc(docRef, sanitizeForFirestore(asset), { merge: true });
  } catch (error) {
    console.error('Error saving media asset to Firestore:', error);
    throw error;
  }
}

export async function deleteMediaAssetFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, MEDIA_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting media asset from Firestore:', error);
    throw error;
  }
}

export async function fetchMediaAssetsFromCloud(): Promise<MediaAsset[]> {
  try {
    const colRef = collection(db, MEDIA_COLLECTION);
    const snap = await getDocs(colRef);
    const list: MediaAsset[] = [];
    snap.forEach((d) => {
      list.push(d.data() as MediaAsset);
    });
    // Sort newest first
    list.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    return list;
  } catch (error) {
    console.error('Error fetching media assets from Firestore:', error);
    return [];
  }
}

export function subscribeToMediaAssets(
  onData: (assets: MediaAsset[]) => void,
  onError?: (error: unknown) => void
): () => void {
  try {
    const colRef = collection(db, MEDIA_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const list: MediaAsset[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as MediaAsset);
        });
        list.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        onData(list);
      },
      (err) => {
        console.warn('Media asset subscription notice:', err);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error('Failed to setup media asset onSnapshot:', err);
    return () => {};
  }
}
