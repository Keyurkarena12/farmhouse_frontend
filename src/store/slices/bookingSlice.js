// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';

// // Async thunks
// export const createBooking = createAsyncThunk(
//   'booking/createBooking',
//   async (bookingData, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(`${API_URL}/bookings`, bookingData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Booking creation failed');
//     }
//   }
// );

// export const fetchUserBookings = createAsyncThunk(
//   'booking/fetchUserBookings',
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         return rejectWithValue('No authentication token found');
//       }

//       console.log('🔍 Fetching user bookings...'); // Debug log

//       const response = await axios.get(`${API_URL}/bookings/my`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         params
//       });

//       console.log('✅ User bookings fetched:', response.data); // Debug log

//       return response.data;
//     } catch (error) {
//       console.error('❌ Fetch user bookings error:', error.response?.data || error.message);
//       return rejectWithValue(
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         'Failed to fetch bookings'
//       );
//     }
//   }
// );

// export const fetchBookingById = createAsyncThunk(
//   'booking/fetchBookingById',
//   async (id, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${API_URL}/bookings/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking');
//     }
//   }
// );

// export const fetchOwnerBookings = createAsyncThunk(
//   'bookings/fetchOwnerBookings',
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         return rejectWithValue('No authentication token found');
//       }

//       const response = await axios.get(`${API_URL}/bookings/owner`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//       });

//       return response.data;
//     } catch (error) {
//       console.error('Fetch owner bookings error:', error);
//       return rejectWithValue(
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         'Failed to fetch owner bookings'
//       );
//     }
//   }
// );


// export const updateBooking = createAsyncThunk(
//   'booking/updateBooking',
//   async ({ id, status, reason }, { rejectWithValue }) => { // ✅ Add reason parameter
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.put(
//         `${API_URL}/bookings/${id}/status`,
//         { status, reason }, // ✅ Include reason in request
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Booking update failed');
//     }
//   }
// );



// export const cancelBooking = createAsyncThunk(
//   'booking/cancelBooking',
//   async ({ id, reason }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.put(`${API_URL}/bookings/${id}/cancel`,
//         { reason },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Booking cancellation failed');
//     }
//   }
// );

// export const checkAvailability = createAsyncThunk(
//   'booking/checkAvailability',
//   async (availabilityData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${API_URL}/bookings/check-availability`, availabilityData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Availability check failed');
//     }
//   }
// );

// export const submitReview = createAsyncThunk(
//   'booking/submitReview',
//   async ({ id, rating, comment }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         `${API_URL}/bookings/${id}/review`,
//         { rating, comment },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Review submission failed');
//     }
//   }
// );

// export const fetchFarmhouseReviews = createAsyncThunk(
//   'booking/fetchFarmhouseReviews',
//   async ({ farmhouseId, params = {} }, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/bookings/farmhouse/${farmhouseId}/reviews`,
//         { params }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
//     }
//   }
// );

// export const fetchOwnerRatings = createAsyncThunk(
//   'booking/fetchOwnerRatings',
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${API_URL}/bookings/owner/ratings`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         'Failed to fetch owner ratings'
//       );
//     }
//   }
// );


// export const fetchBlockedDates = createAsyncThunk(
//   'booking/fetchBlockedDates',
//   async (farmhouseId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_URL}/bookings/farmhouse/${farmhouseId}/blocked-dates`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch blocked dates');
//     }
//   }
// );

// export const updateBlockedDates = createAsyncThunk(
//   'booking/updateBlockedDates',
//   async ({ farmhouseId, dates, action }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.put(
//         `${API_URL}/bookings/farmhouse/${farmhouseId}/blocked-dates`,
//         { dates, action },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update blocked dates');
//     }
//   }
// );

// const initialState = {
//   bookings: [],
//   currentBooking: null,
//   reviews: [],
//   ownerRatings: null,
//   loading: false,
//   error: null,
//   totalPages: 0,
//   currentPage: 1,
//   total: 0,
//   availability: {
//     available: true,
//     conflictingBookings: 0
//   }
// };

// const bookingSlice = createSlice({
//   name: 'booking',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearCurrentBooking: (state) => {
//       state.currentBooking = null;
//     },
//     clearAvailability: (state) => {
//       state.availability = initialState.availability;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Create booking
//       .addCase(createBooking.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createBooking.fulfilled, (state, action) => {
//         state.loading = false;
//         state.bookings.unshift(action.payload.booking);
//         state.error = null;
//       })
//       .addCase(createBooking.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch user bookings
//       .addCase(fetchUserBookings.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserBookings.fulfilled, (state, action) => {
//         state.loading = false;
//         state.bookings = action.payload.bookings;
//         state.totalPages = action.payload.totalPages;
//         state.currentPage = action.payload.currentPage;
//         state.total = action.payload.total;
//         state.error = null;
//       })
//       .addCase(fetchUserBookings.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch booking by ID
//       .addCase(fetchBookingById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchBookingById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentBooking = action.payload;
//         state.error = null;
//       })
//       .addCase(fetchBookingById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Cancel booking
//       .addCase(cancelBooking.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(cancelBooking.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.bookings.findIndex(booking => booking._id === action.payload.booking._id);
//         if (index !== -1) {
//           state.bookings[index] = action.payload.booking;
//         }
//         state.error = null;
//       })
//       .addCase(cancelBooking.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Check availability
//       .addCase(checkAvailability.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(checkAvailability.fulfilled, (state, action) => {
//         state.loading = false;
//         state.availability = action.payload;
//         state.error = null;
//       })
//       .addCase(checkAvailability.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Fetch owner bookings

//       .addCase(fetchOwnerBookings.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchOwnerBookings.fulfilled, (state, action) => {
//         state.loading = false;
//         state.bookings = action.payload;
//       })
//       .addCase(fetchOwnerBookings.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Update booking status
//       .addCase(updateBooking.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateBooking.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.bookings.findIndex(booking => booking._id === action.payload.booking._id);
//         if (index !== -1) {
//           state.bookings[index] = action.payload.booking;
//         }
//         state.error = null;
//       })
//       .addCase(updateBooking.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Submit review

//       .addCase(submitReview.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(submitReview.fulfilled, (state, action) => {
//         state.loading = false;
//         // Update the booking in the list with the new review
//         const index = state.bookings.findIndex(booking => booking._id === action.meta.arg.id);
//         if (index !== -1) {
//           state.bookings[index].review = action.payload.review;
//         }
//         state.error = null;
//       })

//       .addCase(submitReview.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Fetch farmhouse reviews

//       .addCase(fetchFarmhouseReviews.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchFarmhouseReviews.fulfilled, (state, action) => {
//         state.loading = false;
//         state.reviews = action.payload.reviews;
//         state.totalPages = action.payload.totalPages;
//         state.currentPage = action.payload.currentPage;
//         state.total = action.payload.total;
//         state.error = null;
//       })
//       .addCase(fetchFarmhouseReviews.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Fetch owner ratings

//       .addCase(fetchOwnerRatings.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchOwnerRatings.fulfilled, (state, action) => {
//         state.loading = false;
//         state.ownerRatings = action.payload;
//       })
//       .addCase(fetchOwnerRatings.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });

//   },
// });

// export const { clearError, clearCurrentBooking, clearAvailability } = bookingSlice.actions;
// export default bookingSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://farmhouse-backend.vercel.app/api';

// Async thunks
export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/bookings`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Booking creation failed');
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  'booking/fetchUserBookings',
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      console.log('🔍 Fetching user bookings...'); // Debug log

      const response = await axios.get(`${API_URL}/bookings/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params
      });

      console.log('✅ User bookings fetched:', response.data); // Debug log

      return response.data;
    } catch (error) {
      console.error('❌ Fetch user bookings error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch bookings'
      );
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'booking/fetchBookingById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking');
    }
  }
);

export const fetchOwnerBookings = createAsyncThunk(
  'bookings/fetchOwnerBookings',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/bookings/owner`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      return response.data;
    } catch (error) {
      console.error('Fetch owner bookings error:', error);
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch owner bookings'
      );
    }
  }
);

export const updateBooking = createAsyncThunk(
  'booking/updateBooking',
  async ({ id, status, reason }, { rejectWithValue }) => { // ✅ Add reason parameter
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/bookings/${id}/status`,
        { status, reason }, // ✅ Include reason in request
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Booking update failed');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancelBooking',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/bookings/${id}/cancel`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Booking cancellation failed');
    }
  }
);

// ✅ NEW: Remove booking from user's list
export const removeBooking = createAsyncThunk(
  'booking/removeBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/bookings/${bookingId}/remove-from-list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove booking from list');
    }
  }
);
// ✅ NEW: Remove booking from owner's list
export const removeBookingFromOwnerList = createAsyncThunk(
  'bookings/removeFromOwnerList',
  async (bookingId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/bookings/owner/${bookingId}/remove-from-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove booking from owner list');
    }
  }
);

// Add this to your existing async thunks in bookingSlice.js

export const fetchActiveBookingsCount = createAsyncThunk(
  'booking/fetchActiveBookingsCount',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      // You'll need to create this endpoint in your backend
      const response = await axios.get(`${API_URL}/bookings/owner/active-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      return response.data;
    } catch (error) {
      console.error('Fetch active bookings count error:', error);
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch active bookings count'
      );
    }
  }
);

export const checkAvailability = createAsyncThunk(
  'booking/checkAvailability',
  async (availabilityData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/bookings/check-availability`, availabilityData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Availability check failed');
    }
  }
);

export const submitReview = createAsyncThunk(
  'booking/submitReview',
  async ({ id, rating, comment }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/bookings/${id}/review`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Review submission failed');
    }
  }
);

export const fetchFarmhouseReviews = createAsyncThunk(
  'booking/fetchFarmhouseReviews',
  async ({ farmhouseId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/bookings/farmhouse/${farmhouseId}/reviews`,
        { params }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const fetchOwnerRatings = createAsyncThunk(
  'booking/fetchOwnerRatings',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/bookings/owner/ratings`, {
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
        'Failed to fetch owner ratings'
      );
    }
  }
);

export const fetchBlockedDates = createAsyncThunk(
  'booking/fetchBlockedDates',
  async (farmhouseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/bookings/farmhouse/${farmhouseId}/blocked-dates`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blocked dates');
    }
  }
);

export const updateBlockedDates = createAsyncThunk(
  'booking/updateBlockedDates',
  async ({ farmhouseId, dates, action }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/bookings/farmhouse/${farmhouseId}/blocked-dates`,
        { dates, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update blocked dates');
    }
  }
);

// Add this to your existing async thunks in bookingSlice.js


export const fetchAdminBookings = createAsyncThunk(
  'booking/fetchAdminBookings',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/bookings/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch admin bookings'
      );
    }
  }
);

const initialState = {
  bookings: [],
  ownerBookings: [],
  currentBooking: null,
  reviews: [],
  ownerRatings: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  total: 0,
  activeBookingsCount: 0,
  availability: {
    available: true,
    conflictingBookings: 0
  }
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearAvailability: (state) => {
      state.availability = initialState.availability;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload.booking);
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch booking by ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.error = null;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(booking => booking._id === action.payload.booking._id);
        if (index !== -1) {
          state.bookings[index] = action.payload.booking;
        }
        state.error = null;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ NEW: Remove booking from list
      .addCase(removeBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBooking.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the booking from the list
        state.bookings = state.bookings.filter(booking => booking._id !== action.payload.bookingId);
        state.error = null;
      })
      .addCase(removeBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ NEW: Remove booking from owner's list
      .addCase(removeBookingFromOwnerList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBookingFromOwnerList.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from owner's bookings list in state
        state.ownerBookings = state.ownerBookings.filter(
          booking => booking._id !== action.payload.bookingId
        );
      })
      .addCase(removeBookingFromOwnerList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to remove booking from owner list';
      })

      // Add this to your existing extraReducers
      .addCase(fetchActiveBookingsCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveBookingsCount.fulfilled, (state, action) => {
        state.loading = false;
        state.activeBookingsCount = action.payload.count; // Store the count
        state.error = null;
      })
      .addCase(fetchActiveBookingsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check availability
      .addCase(checkAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload;
        state.error = null;
      })
      .addCase(checkAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch owner bookings
      .addCase(fetchOwnerBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerBookings = action.payload;  // ← FIXED
        state.error = null;
      })
      .addCase(fetchOwnerBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update booking status
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(booking => booking._id === action.payload.booking._id);
        if (index !== -1) {
          state.bookings[index] = action.payload.booking;
        }
        state.error = null;
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit review
      .addCase(submitReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.loading = false;
        // Update the booking in the list with the new review
        const index = state.bookings.findIndex(booking => booking._id === action.meta.arg.id);
        if (index !== -1) {
          state.bookings[index].review = action.payload.review;
        }
        state.error = null;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch farmhouse reviews
      .addCase(fetchFarmhouseReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmhouseReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchFarmhouseReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch owner ratings
      .addCase(fetchOwnerRatings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOwnerRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerRatings = action.payload;
      })
      .addCase(fetchOwnerRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch admin bookings
      .addCase(fetchAdminBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload; // Store all bookings
        state.error = null;
      })
      .addCase(fetchAdminBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export const { clearError, clearCurrentBooking, clearAvailability } = bookingSlice.actions;
export default bookingSlice.reducer;