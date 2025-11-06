import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusmart_token');
    console.log('🔐 API Request Interceptor - Token:', token ? 'Exists' : 'Missing');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request headers');
    }
    
    console.log('🌐 Making API request to:', config.url);
    return config;
  },
  (error) => {
    console.error('❌ API Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response Success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      console.log('🔒 401 Unauthorized - Clearing auth data');
      localStorage.removeItem('campusmart_token');
      localStorage.removeItem('campusmart_user');
      // Don't redirect automatically - let component handle it
    }
    
    return Promise.reject(error);
  }
);

export default api;