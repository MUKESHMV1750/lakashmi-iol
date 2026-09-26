import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Async thunks
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    const message = err.response?.data?.message || (err.message === 'Network Error' ? 'Cannot connect to server. Please check if backend server is running on port 5000.' : 'Login failed');
    return rejectWithValue(message);
  }
});

export const googleLogin = createAsyncThunk('auth/googleLogin', async (googleData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/google', googleData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    const message = err.response?.data?.message || (err.message === 'Network Error' ? 'Cannot connect to server. Please check if backend server is running on port 5000.' : 'Google authentication failed');
    return rejectWithValue(message);
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    if (data.token && data.user) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  } catch (err) {
    const message = err.response?.data?.message || (err.message === 'Network Error' ? 'Cannot connect to server. Please check if backend server is running on port 5000.' : 'Registration failed');
    return rejectWithValue(message);
  }
});

export const resendOTP = createAsyncThunk('auth/resendOTP', async (otpData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/resend-otp', otpData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to resend OTP');
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (otpData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/verify-otp', otpData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    // Ignore backend logout errors to ensure client always logs out
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('pendingUserId');
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const savedToken = localStorage.getItem('token');
let savedUser = null;
if (savedToken) {
  try {
    const rawUser = localStorage.getItem('user');
    if (rawUser) savedUser = JSON.parse(rawUser);
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,
    token: savedToken,
    isAuthenticated: Boolean(savedToken && savedUser),
    loading: false,
    error: null,
    pendingUserId: localStorage.getItem('pendingUserId') || null, // for OTP flow
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        try {
          state.token = token;
          state.user = JSON.parse(user);
          state.isAuthenticated = true;
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      }
    },
    setPendingUserId: (state, action) => {
      state.pendingUserId = action.payload;
      if (action.payload) {
        localStorage.setItem('pendingUserId', action.payload);
      } else {
        localStorage.removeItem('pendingUserId');
      }
    },
    updateUserAddresses: (state, action) => {
      if (state.user) {
        state.user.addresses = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        toast.success(`Welcome back, ${action.payload.user.name}!`);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Google Login
      .addCase(googleLogin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        toast.success(`Welcome, ${action.payload.user.name}!`);
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Register
      .addCase(register.pending, (state) => { state.loading = true; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        toast.success(`Account created! Welcome, ${action.payload.user.name}!`);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Resend OTP
      .addCase(resendOTP.fulfilled, (state, action) => {
        toast.success(action.payload.message || 'New OTP sent!');
      })
      .addCase(resendOTP.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Verify OTP
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.pendingUserId = null;
        localStorage.removeItem('pendingUserId');
        toast.success('Email verified! Welcome aboard! 🎉');
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.pendingUserId = null;
        localStorage.removeItem('pendingUserId');
        toast.success('Logged out successfully');
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.pendingUserId = null;
        localStorage.removeItem('pendingUserId');
        toast.success('Logged out successfully');
      })
      // Get Me
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
});

export const { clearError, loadUserFromStorage, setPendingUserId, updateUserAddresses } = authSlice.actions;
export default authSlice.reducer;
