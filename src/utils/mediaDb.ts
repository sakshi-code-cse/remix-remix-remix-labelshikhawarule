/**
 * IndexedDB Media Database Utility
 * Handles persistent storage for large video files, high-resolution media blobs,
 * and discovery reels without hitting localStorage 5MB or Firestore 1MB limits.
 */

const DB_NAME = 'LabelShikhaWaruleMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_blobs';

let dbInstance: IDBDatabase | null = null;

function openMediaDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not supported in this browser'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.warn('IndexedDB open error:', event);
      reject(new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Save a video data URL or media string into IndexedDB
 */
export async function saveMediaItem(key: string, data: string): Promise<void> {
  try {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, key);

      req.onsuccess = () => resolve();
      req.onerror = () => {
        console.warn('Error saving to IndexedDB:', req.error);
        reject(req.error);
      };
    });
  } catch (err) {
    console.warn('IndexedDB storage unavailable, falling back:', err);
  }
}

/**
 * Get a saved media item from IndexedDB
 */
export async function getMediaItem(key: string): Promise<string | null> {
  try {
    const db = await openMediaDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        resolve((req.result as string) || null);
      };
      req.onerror = () => {
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

/**
 * Delete a media item from IndexedDB
 */
export async function deleteMediaItem(key: string): Promise<void> {
  try {
    const db = await openMediaDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch {
    // Ignore error
  }
}

/**
 * Specifically save a Story Video into IndexedDB
 */
export async function saveStoryVideoToDB(storyId: string, videoUrl: string): Promise<void> {
  if (!storyId || !videoUrl) return;
  const key = `story_video_${storyId}`;
  await saveMediaItem(key, videoUrl);
}

/**
 * Specifically retrieve a Story Video from IndexedDB
 */
export async function getStoryVideoFromDB(storyId: string): Promise<string | null> {
  if (!storyId) return null;
  const key = `story_video_${storyId}`;
  return getMediaItem(key);
}

/**
 * Hydrate a list of Discovery Stories with videos stored in IndexedDB
 */
export async function hydrateStoriesWithStoredVideos<T extends { id: string; videoUrl?: string }>(
  stories: T[]
): Promise<T[]> {
  if (!Array.isArray(stories) || stories.length === 0) return stories;

  const hydrated = await Promise.all(
    stories.map(async (story) => {
      // If the story already has a valid http URL or full video, check if there is an indexedDB override
      const storedVideo = await getStoryVideoFromDB(story.id);
      if (storedVideo) {
        return {
          ...story,
          videoUrl: storedVideo,
        };
      }
      return story;
    })
  );

  return hydrated;
}
