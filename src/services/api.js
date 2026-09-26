import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const isAuthPath = ['/login', '/register', '/verify-otp', '/forgot-password', '/reset-password'].includes(window.location.pathname);
      const isAuthApi = err.config?.url?.includes('/auth/');

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (!isAuthPath && !isAuthApi) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
