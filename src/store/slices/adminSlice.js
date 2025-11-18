import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://farmhouse-backend-clean.vercel.app/api';
// const API_URL = 'http://localhost:5000/api';


// Async thunks for admin statistics
export const fetchAdminStatistics = createAsyncThunk(
  'admin/fetchAdminStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/admin/statistics`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch admin statistics'
      );
    }
  }
);

export const fetchDetailedStatistics = createAsyncThunk(
  'admin/fetchDetailedStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/admin/statistics/detailed`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch detailed statistics'
      );
    }
  }
);

// For user management
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async ({ page = 1, limit = 10, role, search } = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: { page, limit, role, search }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch users'
      );
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/users/${userId}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to update user role'
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to delete user'
      );
    }
  }
);

const initialState = {
  // Statistics state
  adminStats: {
    totalUsers: 0,
    totalFarmhouses: 0,
    totalBookings: 0,
    pendingApprovals: 0
  },
  detailedStats: null,
  
  // Users state
  users: [],
  currentUser: null,
  usersLoading: false,
  usersError: null,
  usersTotalPages: 0,
  usersCurrentPage: 1,
  usersTotal: 0,
  
  // General loading and error states
  loading: false,
  error: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.usersError = null;
    },
    clearUsers: (state) => {
      state.users = [];
      state.usersError = null;
    },
    setUsersLoading: (state, action) => {
      state.usersLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Admin Statistics
      .addCase(fetchAdminStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.adminStats = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Detailed Statistics
      .addCase(fetchDetailedStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetailedStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.detailedStats = action.payload;
        state.error = null;
      })
      .addCase(fetchDetailedStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.users;
        state.usersTotalPages = action.payload.totalPages;
        state.usersCurrentPage = action.payload.currentPage;
        state.usersTotal = action.payload.total;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })
      
      // Update User Role
      .addCase(updateUserRole.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.usersLoading = false;
        // Update the user in the users list
        const updatedUser = action.payload.user;
        const index = state.users.findIndex(user => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        state.usersError = null;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })
      
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.usersLoading = false;
        // Remove the user from the users list
        state.users = state.users.filter(user => user._id !== action.meta.arg);
        state.usersError = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      });
  },
});

export const { clearError, clearUsers, setUsersLoading } = adminSlice.actions;
export default adminSlice.reducer;