import { format, parseISO, isValid, formatDistanceToNow } from 'date-fns';
import { DATE_FORMATS, ENV } from './config';

/**
 * Format a date string with the specified format
 * @param {string|Date} dateString - The date string to format
 * @param {string} formatString - The format string to use
 * @returns {string} - The formatted date string or a fallback value
 */
export const formatDate = (dateString, formatString = DATE_FORMATS.DEFAULT) => {
  if (!dateString) return 'N/A';
  
  try {
    // If it's already a Date object, use it directly
    const date = dateString instanceof Date 
      ? dateString 
      : parseISO(dateString);
    
    if (!isValid(date)) {
      return 'Invalid date';
    }
    
    return format(date, formatString);
  } catch (error) {
    if (!ENV.IS_PRODUCTION) {
      console.error(`Error formatting date: ${dateString}`, error);
    }
    return 'Invalid date';
  }
};

/**
 * Format a date string as a relative time (e.g., "5 minutes ago")
 * @param {string|Date} dateString - The date string to format
 * @param {Object} options - Options for formatDistanceToNow
 * @returns {string} - The relative time string
 */
export const formatRelativeTime = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  
  try {
    // If it's already a Date object, use it directly
    const date = dateString instanceof Date 
      ? dateString 
      : parseISO(dateString);
    
    if (!isValid(date)) {
      return 'Invalid date';
    }
    
    return formatDistanceToNow(date, {
      addSuffix: true,
      ...options
    });
  } catch (error) {
    if (!ENV.IS_PRODUCTION) {
      console.error(`Error formatting relative time: ${dateString}`, error);
    }
    return 'Invalid date';
  }
};

/**
 * Format a date for input fields (e.g., datetime-local)
 * @param {string|Date} dateString - The date string to format
 * @returns {string} - The formatted date string for input fields
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  try {
    // If it's already a Date object, use it directly
    const date = dateString instanceof Date 
      ? dateString 
      : parseISO(dateString);
    
    if (!isValid(date)) {
      return '';
    }
    
    return format(date, DATE_FORMATS.INPUT);
  } catch (error) {
    if (!ENV.IS_PRODUCTION) {
      console.error(`Error formatting date for input: ${dateString}`, error);
    }
    return '';
  }
};

/**
 * Check if a date is in the past
 * @param {string|Date} dateString - The date string to check
 * @returns {boolean} - Whether the date is in the past
 */
export const isDateInPast = (dateString) => {
  if (!dateString) return false;
  
  try {
    // If it's already a Date object, use it directly
    const date = dateString instanceof Date 
      ? dateString 
      : parseISO(dateString);
    
    if (!isValid(date)) {
      return false;
    }
    
    return date < new Date();
  } catch (error) {
    if (!ENV.IS_PRODUCTION) {
      console.error(`Error checking if date is in past: ${dateString}`, error);
    }
    return false;
  }
}; 