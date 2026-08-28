// Safe Storage Utility for browser sandboxes, iframes, and cross-origin security contexts

const inMemoryStorage: Record<string, string> = {};

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Sandboxed iframe or cookies/storage blocked
    }
    return inMemoryStorage[key] ?? null;
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      // Storage unavailable or quota exceeded
    }
    inMemoryStorage[key] = value;
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Storage unavailable
    }
    delete inMemoryStorage[key];
  },

  getJSON: <T>(key: string, fallback: T): T => {
    try {
      const raw = safeLocalStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw) as T;
      }
    } catch {
      // Parse error or access error
    }
    return fallback;
  },

  setJSON: <T>(key: string, value: T): void => {
    try {
      safeLocalStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Serialization error
    }
  },
};

/**
 * Safe trigger for canvas-confetti that gracefully handles iframe restrictions,
 * missing canvas contexts, or failed module loads.
 */
export const triggerConfetti = async (options?: any) => {
  try {
    const confettiModule = await import('canvas-confetti');
    const confetti = confettiModule.default || confettiModule;
    if (typeof confetti === 'function') {
      confetti(options || {
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  } catch {
    // Fail silently without interrupting user flow
  }
};
