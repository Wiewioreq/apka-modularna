import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Storage utility functions for AsyncStorage
 */

/**
 * Save data to AsyncStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {Promise<boolean>} Success status
 */
export const saveToStorage = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error);
    return false;
  }
};

/**
 * Load data from AsyncStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {Promise<any>} Stored value or default value
 */
export const loadFromStorage = async (key, defaultValue = null) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
  } catch (error) {
    console.error(`Error loading from storage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Remove data from AsyncStorage
 * @param {string} key - Storage key
 * @returns {Promise<boolean>} Success status
 */
export const removeFromStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from storage (${key}):`, error);
    return false;
  }
};

/**
 * Clear all data from AsyncStorage
 * @returns {Promise<boolean>} Success status
 */
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

/**
 * Get all keys from AsyncStorage
 * @returns {Promise<string[]>} Array of storage keys
 */
export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};

/**
 * Save multiple key-value pairs to AsyncStorage
 * @param {Array<[string, any]>} keyValuePairs - Array of [key, value] pairs
 * @returns {Promise<boolean>} Success status
 */
export const saveMultipleToStorage = async (keyValuePairs) => {
  try {
    const stringifiedPairs = keyValuePairs.map(([key, value]) => [
      key,
      JSON.stringify(value)
    ]);
    await AsyncStorage.multiSet(stringifiedPairs);
    return true;
  } catch (error) {
    console.error('Error saving multiple to storage:', error);
    return false;
  }
};

/**
 * Load multiple values from AsyncStorage
 * @param {string[]} keys - Array of storage keys
 * @returns {Promise<Object>} Object with key-value pairs
 */
export const loadMultipleFromStorage = async (keys) => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    const result = {};
    
    values.forEach(([key, value]) => {
      try {
        result[key] = value ? JSON.parse(value) : null;
      } catch (parseError) {
        console.error(`Error parsing stored value for key ${key}:`, parseError);
        result[key] = null;
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error loading multiple from storage:', error);
    return {};
  }
};

// Storage keys constants
export const STORAGE_KEYS = {
  FAMILY_ID: 'familyId',
  DOG_NAME: 'dogName',
  DOG_BREED: 'dogBreed',
  DOG_DOB: 'dogDob',
  MEMBER_NAME: 'memberName',
  PROGRESS_PHOTOS: 'progressPhotos',
  UNLOCKED_ACHIEVEMENTS: 'unlockedAchievements',
  COMPLETED_DAILY_BY_DATE: 'completedDailyByDate',
  APP_SETTINGS: 'appSettings',
  LAST_SYNC: 'lastSync',
  OFFLINE_CHANGES: 'offlineChanges',
};