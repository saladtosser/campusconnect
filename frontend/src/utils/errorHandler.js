/**
 * Centralized error handling utility
 */

// Format error messages from API responses
export const formatApiError = (error) => {
  if (!error.response) {
    return 'Network error. Please check your connection.';
  }

  const { status, data } = error.response;

  // Handle different status codes
  switch (status) {
    case 400:
      if (data && typeof data === 'object') {
        // Handle validation errors (typically an object with field names as keys)
        return formatValidationErrors(data);
      }
      return data.detail || 'Invalid request. Please check your input.';
    
    case 401:
      return 'Authentication failed. Please login again.';
    
    case 403:
      return 'You do not have permission to perform this action.';
    
    case 404:
      return 'The requested resource was not found.';
    
    case 500:
      return 'Server error. Please try again later.';
    
    default:
      return data.detail || 'An error occurred. Please try again.';
  }
};

// Format validation errors from API responses
export const formatValidationErrors = (errors) => {
  // If errors is a string, return it
  if (typeof errors === 'string') {
    return errors;
  }

  // If errors has a detail field, return it
  if (errors.detail) {
    return errors.detail;
  }

  // Otherwise, format field errors
  let formattedErrors = '';
  
  Object.keys(errors).forEach(key => {
    if (Array.isArray(errors[key])) {
      formattedErrors += `${key}: ${errors[key].join(', ')}\n`;
    } else if (typeof errors[key] === 'object') {
      formattedErrors += `${key}: ${formatValidationErrors(errors[key])}\n`;
    } else {
      formattedErrors += `${key}: ${errors[key]}\n`;
    }
  });
  
  return formattedErrors.trim();
};

// Log errors in development but not in production
export const logError = (error, context = '') => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  }
  // In production, you could send errors to a monitoring service like Sentry
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error);
  // }
};

// Main error handler function
export const handleError = (error, context = '') => {
  logError(error, context);
  return formatApiError(error);
}; 