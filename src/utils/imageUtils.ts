/**
 * Utility functions for image optimization, parsing, serialization, and Supabase upload
 */
import { supabase } from '../lib/supabaseClient';

/**
 * Compresses an image file in the browser using HTML Canvas.
 * Automatically scales down large camera photos (e.g., from smartphones)
 * to a max dimension of 1400px, reducing file sizes from 5-10MB to ~80-180KB
 * while retaining crisp quality for car cards and gallery display.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1400,
  maxHeight = 1050,
  quality = 0.82
): Promise<{ file: File; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    // If it's not an image (or svg/gif which should be kept as-is), return raw dataUrl
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          file,
          dataUrl: reader.result as string
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio constraint
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback if canvas context fails
          const rawUrl = readerEvent.target?.result as string;
          resolve({ file, dataUrl: rawUrl });
          return;
        }

        // Draw and apply smooth bicubic sampling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to dataUrl (JPEG)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        // Also convert to a Blob / File for direct upload to Supabase storage
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const cleanBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
              const compressedFile = new File([blob], `${cleanBaseName}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve({
                file: compressedFile,
                dataUrl: compressedDataUrl
              });
            } else {
              resolve({
                file,
                dataUrl: compressedDataUrl
              });
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        const rawUrl = readerEvent.target?.result as string;
        resolve({ file, dataUrl: rawUrl });
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Robust parsing function for image_url from Supabase or localStorage.
 * Handles:
 * - JSON serialized arrays: '["https://...", "data:image/..."]'
 * - Pipe delimited: 'url1|||url2'
 * - Base64 Data URLs: 'data:image/jpeg;base64,....' (WITHOUT splitting at the comma!)
 * - Comma separated plain URLs: 'https://site.com/1.jpg,https://site.com/2.jpg'
 * - Single direct URLs
 */
export function parseVehicleImages(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const trimmed = String(raw).trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return [];

  // 1. JSON Array string
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
          .map((item) => item.trim());
      }
    } catch {}
  }

  // 2. Pipe delimiter (|||)
  if (trimmed.includes('|||')) {
    return trimmed
      .split('|||')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  // 3. Single Data URL (starts with data:image/)
  if (trimmed.startsWith('data:image/')) {
    return [trimmed];
  }

  // 4. Legacy comma separated (only if it does NOT contain data:image)
  if (trimmed.includes(',') && !trimmed.includes('data:image/')) {
    return trimmed
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  // 5. Single plain URL or path
  return [trimmed];
}

/**
 * Serializes an array of image URLs or base64 data URLs for storage in Supabase text column.
 * Uses JSON.stringify for safe preservation of all special characters and base64 strings.
 */
export function serializeVehicleImages(images: string[] | null | undefined): string | null {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  const validImages = images
    .map((img) => (typeof img === 'string' ? img.trim() : ''))
    .filter((img) => img.length > 0);

  if (validImages.length === 0) {
    return null;
  }

  // Use JSON stringification so data URLs and URLs with parameters are preserved 100% intact
  return JSON.stringify(validImages);
}

/**
 * Uploads an image file to Supabase Storage bucket 'vehicle-images'.
 * If the bucket exists and upload succeeds, returns the public URL.
 * If storage fails (e.g. bucket not yet created or permissions), seamlessly
 * falls back to the compressed base64 data URL so the vehicle ALWAYS displays immediately!
 */
export async function uploadVehicleImage(file: File): Promise<string> {
  // 1. Optimize / compress image first
  const { file: optimizedFile, dataUrl } = await compressImageFile(file);

  const fileExt = optimizedFile.name.split('.').pop() || 'jpg';
  const cleanName = optimizedFile.name.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${Date.now()}_${cleanName}.${fileExt}`;
  const filePath = `${fileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from('vehicle-images')
      .upload(filePath, optimizedFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.warn(
        'Supabase Storage upload fallback: bucket "vehicle-images" not ready or permission denied. Using optimized base64 payload.',
        uploadError
      );
      return dataUrl;
    }

    const { data } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(filePath);

    if (data && data.publicUrl) {
      return data.publicUrl;
    }

    return dataUrl;
  } catch (err) {
    console.warn('Storage exception, using optimized base64:', err);
    return dataUrl;
  }
}
