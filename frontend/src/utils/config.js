/**
 * Application configuration
 */

// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 30000, // 30 seconds
};

// Auth configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: 'token',
  REFRESH_TOKEN_KEY: 'refreshToken',
  USER_KEY: 'user',
  STORAGE_PREFIX: 'campusconnect_',
};

// Date formats
export const DATE_FORMATS = {
  DEFAULT: 'MMM d, yyyy',
  FULL: 'EEEE, MMMM d, yyyy',
  TIME: 'h:mm a',
  DATETIME: 'MMM d, yyyy h:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  INPUT: "yyyy-MM-dd'T'HH:mm",
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// Feature flags
export const FEATURES = {
  ENABLE_GUEST_REGISTRATION: true,
  ENABLE_QR_CODE_SCANNING: true,
  ENABLE_NOTIFICATIONS: process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
};

// Environment detection
export const ENV = {
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_TEST: process.env.NODE_ENV === 'test',
};

// Timeout durations (in milliseconds)
export const TIMEOUTS = {
  ALERT_AUTO_DISMISS: 5000,
  DEBOUNCE_SEARCH: 300,
  API_RETRY_DELAY: 1000,
}; 