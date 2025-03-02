import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const initialState = {
  users: [],
  user: null,
  isLoading: false,
  error: null,
  success: false,
};

// Get all users (admin only)
export const getUsers = createAsyncThunk(
  'users/getAll',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/auth/users/`, config);
      
      return response.data;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user by ID (admin only)
export const getUserById = createAsyncThunk(
  'users/getById',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/auth/users/${id}/`, config);
      
      return response.data;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user (admin only)
export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, userData }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(`${API_URL}/auth/users/${id}/`, userData, config);
      
      return response.data;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user (admin only)
export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.delete(`${API_URL}/auth/users/${id}/`, config);
      
      return id;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user profile
export const fetchProfile = createAsyncThunk(
  'users/profile',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/auth/profile/`, config);
      
      return response.data;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch user by ID (alias for getUserById)
export const fetchUserById = getUserById;

// Toggle user active status (admin only)
export const toggleUserActive = createAsyncThunk(
  'users/toggleActive',
  async ({ id, isActive }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(
        `${API_URL}/auth/users/${id}/`, 
        { is_active: isActive }, 
        config
      );
      
      return response.data;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Toggle user admin status (admin only)
export const toggleUserAdmin = createAsyncThunk(
  'users/toggleAdmin',
  async ({ id, isAdmin }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(
        `${API_URL}/auth/users/${id}/`, 
        { role: isAdmin ? 'admin' : 'student' }, 
        config
      );
      
      return response.data;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
        
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.results || action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get user by ID
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.users = state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get user profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { reset, clearUser } = userSlice.actions;

// Aliases for backward compatibility
export const fetchUsers = getUsers;
export const updateProfile = updateUser;

export default userSlice.reducer; 