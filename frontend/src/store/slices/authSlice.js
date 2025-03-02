import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { handleError } from '../../utils/errorHandler';
import { getItem, setItem, removeItem } from '../../utils/storage';
import { AUTH_CONFIG } from '../../utils/config';

// Get user from localStorage
const user = getItem(AUTH_CONFIG.USER_KEY);
const token = getItem(AUTH_CONFIG.TOKEN_KEY);

const initialState = {
  user: user || null,
  token: token || null,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/auth/register/', userData);
      
      if (response.data) {
        setItem(AUTH_CONFIG.USER_KEY, response.data.user);
        setItem(AUTH_CONFIG.TOKEN_KEY, response.data.access);
        setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, response.data.refresh);
      }
      
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error, 'register'));
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/auth/token/', userData);
      
      if (response.data.access) {
        // Get user profile after successful login
        const userResponse = await api.get('/auth/profile/', {
          headers: {
            Authorization: `Bearer ${response.data.access}`,
          },
        });
        
        setItem(AUTH_CONFIG.USER_KEY, userResponse.data);
        setItem(AUTH_CONFIG.TOKEN_KEY, response.data.access);
        setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, response.data.refresh);
        
        return {
          user: userResponse.data,
          token: response.data.access,
          refreshToken: response.data.refresh,
        };
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error, 'login'));
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  removeItem(AUTH_CONFIG.USER_KEY);
  removeItem(AUTH_CONFIG.TOKEN_KEY);
  removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
});

// Update user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, thunkAPI) => {
    try {
      const response = await api.put('/auth/profile/', userData);
      
      // Update user in localStorage
      setItem(AUTH_CONFIG.USER_KEY, response.data);
      
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleError(error, 'updateProfile'));
    }
  }
);

// Listen for logout events (for example, from token refresh failure)
if (typeof window !== 'undefined') {
  window.addEventListener('logout', () => {
    removeItem(AUTH_CONFIG.USER_KEY);
    removeItem(AUTH_CONFIG.TOKEN_KEY);
    removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    window.location.href = '/login';
  });
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.error = null;
      state.success = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.access;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer; 