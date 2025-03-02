import axios from 'axios';
import { getStringItem, setItem, removeItem } from './storage';
import { API_CONFIG, AUTH_CONFIG } from './config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Add request interceptor to attach token to requests
api.interceptors.request.use(
  (config) => {
    const token = getStringItem(AUTH_CONFIG.TOKEN_KEY);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getStringItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
        if (!refreshToken) {
          // No refresh token available, logout the user
          window.dispatchEvent(new CustomEvent('logout'));
          return Promise.reject(error);
        }
        
        // Request a new token
        const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });
        
        if (response.data.access) {
          // Save the new token
          setItem(AUTH_CONFIG.TOKEN_KEY, response.data.access);
          
          // Update the header and retry the original request
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout the user
        window.dispatchEvent(new CustomEvent('logout'));
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 