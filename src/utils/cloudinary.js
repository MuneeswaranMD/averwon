/**
 * Cloudinary Upload Service
 * Handles secure, unsigned image uploads to Cloudinary for Averqon
 */

export const CLOUDINARY_CONFIG = {
  cloudName: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME) 
    || (typeof process !== 'undefined' && process.env?.CLOUDINARY_CLOUD_NAME) 
    || 'dtpqjzpnz',
  uploadPreset: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CLOUDINARY_UPLOAD_PRESET) 
    || (typeof process !== 'undefined' && process.env?.CLOUDINARY_UPLOAD_PRESET) 
    || 'ml_default',
  apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CLOUDINARY_API_KEY) 
    || (typeof process !== 'undefined' && process.env?.CLOUDINARY_API_KEY) 
    || '222847537577522'
};

/**
 * Upload an image file, blob, or base64 data to Cloudinary
 * @param {File|Blob|string} fileOrData - The image file, blob, or base64 string
 * @param {Object} options - Optional parameters (e.g. folder, tags)
 * @returns {Promise<{success: boolean, url?: string, publicId?: string, error?: string}>}
 */
export async function uploadImageToCloudinary(fileOrData, options = {}) {
  try {
    if (!fileOrData) {
      throw new Error('No file provided for upload.');
    }

    const { cloudName, uploadPreset, apiKey } = CLOUDINARY_CONFIG;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();
    formData.append('file', fileOrData);
    formData.append('upload_preset', uploadPreset);
    if (apiKey) formData.append('api_key', apiKey);
    if (options.folder) formData.append('folder', options.folder);
    if (options.tags) formData.append('tags', options.tags);

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errMsg = data.error?.message || `Cloudinary upload failed with status ${response.status}`;
      console.error('[Cloudinary] Upload Error:', errMsg);
      return { success: false, error: errMsg };
    }

    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes
    };
  } catch (err) {
    console.error('[Cloudinary] Network or Execution Error:', err);
    return {
      success: false,
      error: err.message || 'An error occurred during Cloudinary upload.'
    };
  }
}

export default uploadImageToCloudinary;
