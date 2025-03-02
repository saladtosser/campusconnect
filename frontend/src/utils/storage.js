import { AUTH_CONFIG, ENV } from './config';

/**
 * Utility functions for safer local storage operations
 */

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Get prefixed key
const getPrefixedKey = (key) => {
  return `${AUTH_CONFIG.STORAGE_PREFIX}${key}`;
};

// Get an item from localStorage
export const getItem = (key) => {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const prefixedKey = getPrefixedKey(key);
    const item = localStorage.getItem(prefixedKey);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    if (!ENV.IS_PRODUCTION) {
      console.error(`Error getting item ${key} from localStorage:`, error);
    }
    return null;
  }
};

// Get a string item from localStorage (no parsing)
export const getStringItem = (key) => {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const prefixedKey = getPrefixedKey(key);
    return localStorage.getItem(prefixedKey);
  } catch (error) {
    if (!ENV.IS_PRODUCTION) {
      console.error(`Error getting string item ${key} from localStorage:`, error);
    }
    return null;
  }
};

// Set an item in localStorage
export const setItem = (key, value) => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const prefixedKey = getPrefixedKey(key);
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(prefixedKey, serializedValue);
    return true;
  } catch (error) {
    if (!ENV.IS_PRODUCTION) {
      console.error(`Error setting item ${key} in localStorage:`, error);
    }
    return false;
  }
};

// Remove an item from localStorage
export const removeItem = (key) => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const prefixedKey = getPrefixedKey(key);
    localStorage.removeItem(prefixedKey);
    return true;
  } catch (error) {
    if (!ENV.IS_PRODUCTION) {
      console.error(`Error removing item ${key} from localStorage:`, error);
    }
    return false;
  }
};

// Clear all items from localStorage with the app prefix
export const clearStorage = () => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(AUTH_CONFIG.STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    if (!ENV.IS_PRODUCTION) {
      console.error('Error clearing localStorage:', error);
    }
    return false;
  }
}; 