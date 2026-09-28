export interface CompressedImageResult {
  base64: string;
  sizeBytes: number;
  sizeFormatted: string;
  width: number;
  height: number;
  format: string;
  isSafeForFirestore: boolean; // Must be < 850KB to respect 1MB doc ceiling
}

/**
 * Optimizes an image for high visual quality while producing a compact base64
 * representation that safely fits into Firestore documents (< 850 KB limit).
 * 
 * Uses HTML5 Canvas with bicubic smoothing and modern WebP / high-quality JPEG encoding.
 */
export async function compressImageToBase64(
  file: File,
  maxDimension: number = 1200,
  initialQuality: number = 0.86
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    // 1. Read file as image
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file format.'));
      img.onload = () => {
        try {
          // Calculate proportional dimensions
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          // Render on offscreen canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            throw new Error('Canvas context could not be created.');
          }

          // Enable high-fidelity smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Test WebP support with progressive quality fallback
          let format = 'image/webp';
          let quality = initialQuality;
          let dataUrl = canvas.toDataURL(format, quality);

          // If browser didn't encode as webp (e.g. returned png), fallback to image/jpeg
          if (!dataUrl.startsWith('data:image/webp')) {
            format = 'image/jpeg';
            dataUrl = canvas.toDataURL(format, quality);
          }

          // Calculate byte size (base64 string length * 3/4 approx)
          let base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
          let sizeBytes = Math.floor(base64Length * 0.75);

          // Safe limit for Firestore document (1MB max document, reserving room for other fields)
          const MAX_SAFE_BYTES = 750 * 1024; // 750 KB safe limit

          // If still over 750KB, step down quality slightly while preserving high resolution
          if (sizeBytes > MAX_SAFE_BYTES) {
            quality = 0.75;
            dataUrl = canvas.toDataURL(format, quality);
            base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
            sizeBytes = Math.floor(base64Length * 0.75);
          }

          if (sizeBytes > MAX_SAFE_BYTES) {
            quality = 0.65;
            dataUrl = canvas.toDataURL(format, quality);
            base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
            sizeBytes = Math.floor(base64Length * 0.75);
          }

          const sizeKb = (sizeBytes / 1024).toFixed(1);
          const sizeFormatted = sizeBytes >= 1024 * 1024 
            ? `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB` 
            : `${sizeKb} KB`;

          resolve({
            base64: dataUrl,
            sizeBytes,
            sizeFormatted,
            width,
            height,
            format: format.replace('image/', '').toUpperCase(),
            isSafeForFirestore: sizeBytes < 850 * 1024
          });
        } catch (err) {
          reject(err);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
