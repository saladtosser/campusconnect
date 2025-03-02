import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const initialState = {
  events: [],
  event: null,
  isLoading: false,
  error: null,
  success: false,
  totalPages: 0,
  currentPage: 1,
};

// Get all events
export const getEvents = createAsyncThunk(
  'events/getAll',
  async (params, thunkAPI) => {
    try {
      const { page = 1, search = '', upcoming = false } = params || {};
      
      const response = await axios.get(
        `${API_URL}/events/?page=${page}&search=${search}${upcoming ? '&upcoming=true' : ''}`
      );
      
      return {
        events: response.data.results,
        totalPages: Math.ceil(response.data.count / 10),
        currentPage: page,
      };
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

// Get event by ID
export const getEventById = createAsyncThunk(
  'events/getById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/events/${id}/`);
      
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

// Create new event
export const createEvent = createAsyncThunk(
  'events/create',
  async (eventData, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post(`${API_URL}/events/create/`, eventData, config);
      
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

// Update event
export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ id, eventData }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(`${API_URL}/events/${id}/update/`, eventData, config);
      
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

// Delete event
export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.delete(`${API_URL}/events/${id}/delete/`, config);
      
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

export const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
    clearEvent: (state) => {
      state.event = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all events
      .addCase(getEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.events;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get event by ID
      .addCase(getEventById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.event = action.payload;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.events = state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        );
        state.event = action.payload;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.events = state.events.filter((event) => event.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { reset, clearEvent } = eventSlice.actions;

// Aliases for backward compatibility
export const fetchEvents = getEvents;
export const fetchEventById = getEventById;

export default eventSlice.reducer; 