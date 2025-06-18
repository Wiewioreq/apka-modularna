import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

/**
 * Convert image URI to base64 string
 * @param {string} uri - Image URI
 * @returns {Promise<Object|null>} Object with base64 and type, or null if failed
 */
export const imageToBase64 = async (uri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, { 
      encoding: FileSystem.EncodingType.Base64 
    });
    return { 
      base64, 
      type: uri.split('.').pop() || 'jpg' 
    };
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
};

/**
 * Request camera permissions
 * @returns {Promise<boolean>} True if permission granted
 */
export const requestCameraPermission = async () => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error requesting camera permission:", error);
    return false;
  }
};

/**
 * Request media library permissions
 * @returns {Promise<boolean>} True if permission granted
 */
export const requestMediaLibraryPermission = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error requesting media library permission:", error);
    return false;
  }
};

/**
 * Take a photo using camera
 * @param {Object} options - Camera options
 * @returns {Promise<Object|null>} Image result or null if cancelled/failed
 */
export const takePhoto = async (options = {}) => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    throw new Error("Camera permission not granted");
  }

  const defaultOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  };

  try {
    const result = await ImagePicker.launchCameraAsync({
      ...defaultOptions,
      ...options
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0];
  } catch (error) {
    console.error("Error taking photo:", error);
    throw error;
  }
};

/**
 * Pick an image from gallery
 * @param {Object} options - Picker options
 * @returns {Promise<Object|null>} Image result or null if cancelled/failed
 */
export const pickImage = async (options = {}) => {
  const hasPermission = await requestMediaLibraryPermission();
  if (!hasPermission) {
    throw new Error("Media library permission not granted");
  }

  const defaultOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  };

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      ...defaultOptions,
      ...options
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0];
  } catch (error) {
    console.error("Error picking image:", error);
    throw error;
  }
};

/**
 * Create a progress photo object
 * @param {Object} imageAsset - Image asset from ImagePicker
 * @param {number} week - Training week number
 * @returns {Promise<Object>} Progress photo object
 */
export const createProgressPhoto = async (imageAsset, week) => {
  const imageData = await imageToBase64(imageAsset.uri);
  
  return {
    uri: imageAsset.uri,
    base64: imageData?.base64,
    type: imageData?.type || 'jpg',
    timestamp: new Date().toISOString(),
    week: week,
    width: imageAsset.width,
    height: imageAsset.height,
  };
};

/**
 * Resize image URI to specified dimensions
 * @param {string} uri - Image URI
 * @param {number} width - Target width
 * @param {number} height - Target height
 * @returns {Promise<string>} Resized image URI
 */
export const resizeImage = async (uri, width, height) => {
  try {
    // For Expo, you might want to use expo-image-manipulator
    // This is a placeholder implementation
    console.log(`Resizing image ${uri} to ${width}x${height}`);
    return uri; // Return original URI for now
  } catch (error) {
    console.error("Error resizing image:", error);
    return uri;
  }
};

/**
 * Get image dimensions
 * @param {string} uri - Image URI
 * @returns {Promise<Object>} Object with width and height
 */
export const getImageDimensions = async (uri) => {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    // This is a basic implementation
    // For actual dimensions, you might need expo-image-manipulator
    return {
      width: 0,
      height: 0,
      size: info.size
    };
  } catch (error) {
    console.error("Error getting image dimensions:", error);
    return { width: 0, height: 0, size: 0 };
  }
};

/**
 * Delete image file
 * @param {string} uri - Image URI
 * @returns {Promise<boolean>} Success status
 */
export const deleteImage = async (uri) => {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
};