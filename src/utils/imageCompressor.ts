/**
 * Image Compression and Optimization Utility
 * Prevents localStorage QuotaExceededError by resizing and compressing uploaded image files
 * to high-clarity, lightweight data URLs suitable for web preview and local storage.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export const compressImageFile = (
  file: File,
  options: CompressionOptions = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Invalid image file'));
    }

    const {
      maxWidth = 1000,
      maxHeight = 1333,
      quality = 0.84,
      mimeType = 'image/jpeg',
    } = options;

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const src = readerEvent.target?.result as string;
      if (!src) {
        return resolve('');
      }

      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate proportional scale
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(width, 10);
        canvas.height = Math.max(height, 10);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(src);
        }

        // Fill background with white for transparency safety in JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        try {
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(src);
        }
      };

      img.onerror = () => {
        resolve(src);
      };

      img.src = src;
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export const compressDataUrl = (
  dataUrl: string,
  options: CompressionOptions = {}
): Promise<string> => {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      return resolve(dataUrl);
    }

    const {
      maxWidth = 1000,
      maxHeight = 1333,
      quality = 0.84,
      mimeType = 'image/jpeg',
    } = options;

    const img = new Image();
    img.onload = () => {
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(width, 10);
      canvas.height = Math.max(height, 10);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(dataUrl);
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      try {
        const compressed = canvas.toDataURL(mimeType, quality);
        resolve(compressed);
      } catch {
        resolve(dataUrl);
      }
    };

    img.onerror = () => {
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
};
