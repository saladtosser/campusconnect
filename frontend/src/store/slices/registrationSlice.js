import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const initialState = {
  registrations: [],
  registration: null,
  isLoading: false,
  error: null,
  success: false,
};

// Get user registrations
export const getUserRegistrations = createAsyncThunk(
  'registrations/getUserRegistrations',
  async (userId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      // If userId is provided, fetch registrations for that user (admin only)
      // Otherwise, fetch the current user's registrations
      const url = userId 
        ? `${API_URL}/registrations/admin/?user_id=${userId}` 
        : `${API_URL}/registrations/`;
      
      const response = await axios.get(url, config);
      
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

// Get registration by ID
export const getRegistrationById = createAsyncThunk(
  'registrations/getById',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_URL}/registrations/${id}/`, config);
      
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

// Register for event
export const registerForEvent = createAsyncThunk(
  'registrations/register',
  async (eventId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post(
        `${API_URL}/registrations/create/`,
        { event_id: eventId },
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

// Cancel registration
export const cancelRegistration = createAsyncThunk(
  'registrations/cancel',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(`${API_URL}/registrations/${id}/cancel/`, {}, config);
      
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

// Check in registration
export const checkInRegistration = createAsyncThunk(
  'registrations/checkIn',
  async ({ qr_code, event_id }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post(
        `${API_URL}/registrations/check-in/`,
        { qr_code, event_id },
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

// Get admin registrations
export const getAdminRegistrations = createAsyncThunk(
  'registrations/getAdminRegistrations',
  async ({ event_id, status }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      let url = `${API_URL}/registrations/admin/`;
      
      // Add query parameters if provided
      const params = new URLSearchParams();
      if (event_id) params.append('event_id', event_id);
      if (status) params.append('status', status);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url, config);
      
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

// Fetch registration QR code
export const fetchRegistrationQRCode = createAsyncThunk(
  'registrations/fetchQRCode',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(
        `${API_URL}/registrations/${id}/qr-code/`,
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

// Fetch registrations by event (admin only)
export const fetchRegistrationsByEvent = createAsyncThunk(
  'registrations/byEvent',
  async (eventId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(
        `${API_URL}/registrations/admin/?event_id=${eventId}`,
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

// Fetch all registrations (admin only)
export const fetchAllRegistrations = createAsyncThunk(
  'registrations/fetchAll',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(
        `${API_URL}/registrations/admin/`,
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

// Approve registration (admin only)
export const approveRegistration = createAsyncThunk(
  'registrations/approve',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(
        `${API_URL}/registrations/${id}/approve/`,
        {},
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

// Reject registration (admin only)
export const rejectRegistration = createAsyncThunk(
  'registrations/reject',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(
        `${API_URL}/registrations/${id}/reject/`,
        {},
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

export const registrationSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
    clearRegistration: (state) => {
      state.registration = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user registrations
      .addCase(getUserRegistrations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserRegistrations.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle paginated response by extracting the results array
        state.registrations = action.payload.results || action.payload;
      })
      .addCase(getUserRegistrations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get registration by ID
      .addCase(getRegistrationById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRegistrationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registration = action.payload;
      })
      .addCase(getRegistrationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register for event
      .addCase(registerForEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.registrations.push(action.payload);
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel registration
      .addCase(cancelRegistration.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.registrations = state.registrations.map((registration) =>
          registration.id === action.payload.id ? action.payload : registration
        );
        if (state.registration && state.registration.id === action.payload.id) {
          state.registration = action.payload;
        }
      })
      .addCase(cancelRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Check in registration
      .addCase(checkInRegistration.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkInRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.registrations = state.registrations.map((registration) =>
          registration.id === action.payload.id ? action.payload : registration
        );
      })
      .addCase(checkInRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get admin registrations
      .addCase(getAdminRegistrations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdminRegistrations.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle paginated response by extracting the results array
        state.registrations = action.payload.results || action.payload;
      })
      .addCase(getAdminRegistrations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get registration QR code
      .addCase(fetchRegistrationQRCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRegistrationQRCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registration = action.payload;
      })
      .addCase(fetchRegistrationQRCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch registrations by event
      .addCase(fetchRegistrationsByEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRegistrationsByEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle paginated response by extracting the results array
        state.registrations = action.payload.results || action.payload;
      })
      .addCase(fetchRegistrationsByEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch all registrations
      .addCase(fetchAllRegistrations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllRegistrations.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle paginated response by extracting the results array
        state.registrations = action.payload.results || action.payload;
      })
      .addCase(fetchAllRegistrations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Approve registration
      .addCase(approveRegistration.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(approveRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.registrations = state.registrations.map((registration) =>
          registration.id === action.payload.id ? action.payload : registration
        );
      })
      .addCase(approveRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Reject registration
      .addCase(rejectRegistration.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(rejectRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.registrations = state.registrations.map((registration) =>
          registration.id === action.payload.id ? action.payload : registration
        );
      })
      .addCase(rejectRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { reset, clearRegistration } = registrationSlice.actions;

// Aliases for backward compatibility
export const fetchUserRegistrations = getUserRegistrations;
export const fetchRegistrations = getAdminRegistrations;

export default registrationSlice.reducer; 