import { db, doc, setDoc, getDoc, onSnapshot } from './firebase';
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
  DiscoveryStory 
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
  lastUpdated?: string;
}

const STORE_CONFIG_DOC = 'main_store_data';

// Helper to sanitize large or undefined data before saving
function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

/**
 * Save specific key or full store state to cloud Firestore
 */
export async function saveToCloudDatabase<K extends keyof AppDatabaseState>(
  key: K,
  value: AppDatabaseState[K]
): Promise<void> {
  try {
    const docRef = doc(db, 'store_settings', STORE_CONFIG_DOC);
    await setDoc(
      docRef,
      {
        [key]: sanitizeForFirestore(value),
        lastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error(`Error saving ${key} to Firestore:`, error);
  }
}

/**
 * Save full store snapshot to cloud Firestore
 */
export async function saveFullStoreSnapshot(state: Partial<AppDatabaseState>): Promise<void> {
  try {
    const docRef = doc(db, 'store_settings', STORE_CONFIG_DOC);
    await setDoc(
      docRef,
      {
        ...sanitizeForFirestore(state),
        lastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving store snapshot to Firestore:', error);
  }
}

/**
 * Fetch initial cloud state once
 */
export async function fetchCloudStoreData(): Promise<Partial<AppDatabaseState> | null> {
  try {
    const docRef = doc(db, 'store_settings', STORE_CONFIG_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Partial<AppDatabaseState>;
    }
    return null;
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
    const docRef = doc(db, 'store_settings', STORE_CONFIG_DOC);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onData(docSnap.data() as Partial<AppDatabaseState>);
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
