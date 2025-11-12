import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://farmhouse-backend.vercel.app/api';

// const API_URL = 'http://localhost:5000/api';


const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fetch owner's farmhouses
export const fetchOwnerFarmhouses = createAsyncThunk(
  'farmhouse/fetchOwnerFarmhouses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/farmhouses/owner/my-farmhouses', { 
        params: { ...params, populate: 'owner' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your farmhouses');
    }
  }
);

// Public farmhouses
export const fetchFarmhouses = createAsyncThunk(
  'farmhouse/fetchFarmhouses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/farmhouses', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch farmhouses');
    }
  }
);

// Fetch single farmhouse
export const fetchFarmhouseById = createAsyncThunk(
  'farmhouse/fetchFarmhouseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/farmhouses/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch farmhouse');
    }
  }
);

// Search farmhouses
export const searchFarmhouses = createAsyncThunk(
  'farmhouse/searchFarmhouses',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/farmhouses', { params: searchParams });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

// Search by location
export const searchByLocation = createAsyncThunk(
  'farmhouse/searchByLocation',
  async (locationData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/farmhouses/search/location', {
        params: locationData
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Location search failed');
    }
  }
);

// CREATE Farmhouse
export const createFarmhouse = createAsyncThunk(
  'farmhouse/createFarmhouse',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/farmhouses', data);
      return response.data.farmhouse;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create farmhouse');
    }
  }
);

// UPDATE Farmhouse
export const updateFarmhouse = createAsyncThunk(
  'farmhouse/updateFarmhouse',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/farmhouses/${id}`, data);
      return response.data.farmhouse;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update farmhouse');
    }
  }
);

// DELETE Farmhouse
export const deleteFarmhouse = createAsyncThunk(
  'farmhouse/deleteFarmhouse',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/farmhouses/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete farmhouse');
    }
  }
);

// Fetch pending farmhouses for admin
export const fetchPendingFarmhouses = createAsyncThunk(
  'farmhouse/fetchPendingFarmhouses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/farmhouses/admin/pending', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending farmhouses');
    }
  }
);

// ✅ FIXED: Approve farmhouse - SIMPLIFIED
export const approveFarmhouse = createAsyncThunk(
  'farmhouse/approveFarmhouse',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🔄 Approving farmhouse ID:', id);

      // Simple validation
      if (!id || typeof id !== 'string') {
        return rejectWithValue('Invalid farmhouse ID');
      }

      // ✅ FIXED: Empty object bhejo taki backend ko body mile
      const response = await axiosInstance.put(`/farmhouses/admin/approve/${id}`, {});

      console.log('✅ Approve response:', response.data);
      
      return response.data.farmhouse;
    } catch (error) {
      console.error('❌ Approve farmhouse error:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          'Failed to approve farmhouse';
      
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ FIXED: Reject farmhouse - SIMPLIFIED
export const rejectFarmhouse = createAsyncThunk(
  'farmhouse/rejectFarmhouse',
  async ({ id, rejectionReason }, { rejectWithValue }) => {
    try {
      console.log('Rejecting farmhouse with ID:', id, 'Reason:', rejectionReason);

      const response = await axiosInstance.put(`/farmhouses/admin/reject/${id}`, {
        rejectionReason
      });

      console.log('Reject response:', response.data);
      
      return response.data.farmhouse;
    } catch (error) {
      console.error('Reject farmhouse error:', error.response?.data);
      
      return rejectWithValue(
        error.response?.data?.message || 
        'Failed to reject farmhouse'
      );
    }
  }
);

const initialState = {
  farmhouses: [],
  pendingFarmhouses: [],
  currentFarmhouse: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  total: 0,
  searchParams: {
    search: '',
    city: '',
    state: '',
    minPrice: '',
    maxPrice: '',
    amenities: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  }
};

const farmhouseSlice = createSlice({
  name: 'farmhouse',
  initialState,
  reducers: {
    setSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    clearSearchParams: (state) => {
      state.searchParams = initialState.searchParams;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentFarmhouse: (state) => {
      state.currentFarmhouse = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch owner's farmhouses
      .addCase(fetchOwnerFarmhouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerFarmhouses.fulfilled, (state, action) => {
        state.loading = false;
        state.farmhouses = action.payload.farmhouses;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchOwnerFarmhouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Public farmhouses
      .addCase(fetchFarmhouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmhouses.fulfilled, (state, action) => {
        state.loading = false;
        state.farmhouses = action.payload.farmhouses;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchFarmhouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchFarmhouseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmhouseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFarmhouse = action.payload;
      })
      .addCase(fetchFarmhouseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search farmhouses
      .addCase(searchFarmhouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFarmhouses.fulfilled, (state, action) => {
        state.loading = false;
        state.farmhouses = action.payload.farmhouses;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
      })
      .addCase(searchFarmhouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search by location
      .addCase(searchByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchByLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.farmhouses = action.payload;
      })
      .addCase(searchByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createFarmhouse.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFarmhouse.fulfilled, (state, action) => {
        state.loading = false;
        state.farmhouses.unshift(action.payload);
      })
      .addCase(createFarmhouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      

      // UPDATE
      .addCase(updateFarmhouse.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFarmhouse.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.farmhouses.findIndex((f) => f._id === action.payload._id);
        if (idx !== -1) state.farmhouses[idx] = action.payload;
      })
      .addCase(updateFarmhouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteFarmhouse.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFarmhouse.fulfilled, (state, action) => {
        state.loading = false;
        state.farmhouses = state.farmhouses.filter((f) => f._id !== action.payload);
      })
      .addCase(deleteFarmhouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Pending farmhouses
      .addCase(fetchPendingFarmhouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingFarmhouses.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingFarmhouses = action.payload.farmhouses;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchPendingFarmhouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve farmhouse
      .addCase(approveFarmhouse.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveFarmhouse.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingFarmhouses = state.pendingFarmhouses.filter(
          f => f._id !== action.payload._id
        );
      })
      .addCase(approveFarmhouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reject farmhouse
      .addCase(rejectFarmhouse.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectFarmhouse.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingFarmhouses = state.pendingFarmhouses.filter(
          f => f._id !== action.payload._id
        );
      })
      .addCase(rejectFarmhouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchParams, clearSearchParams, clearError, clearCurrentFarmhouse } =
  farmhouseSlice.actions;
export default farmhouseSlice.reducer;