import api from './api';

export const authService = {
  login: async (email, password) => {
    try {
      console.log('🔄 authService: Sending login request...', { email });
      
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });
      
      console.log('✅ authService: Login response received');
      console.log('📦 authService: Response data:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ authService: Login error:', error);
      console.error('❌ authService: Error response:', error.response?.data);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      console.log('🔄 authService: Sending registration request...', { 
        email: userData.email,
        name: userData.name 
      });
      
      const response = await api.post('/auth/register', userData);
      
      console.log('✅ authService: Registration response received');
      console.log('📦 authService: Response data:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ authService: Registration error:', error);
      console.error('❌ authService: Error response:', error.response?.data);
      throw error;
    }
  },

  logout: async () => {
    try {
      console.log('🔄 authService: Sending logout request...');
      
      const response = await api.post('/auth/logout');
      
      console.log('✅ authService: Logout response received');
      
      return response.data;
    } catch (error) {
      console.error('❌ authService: Logout error:', error);
      // Even if logout API fails, we should still clear local storage
      throw error;
    }
  },

  getProfile: async () => {
    try {
      console.log('🔄 authService: Fetching user profile...');
      
      const response = await api.get('/auth/profile');
      
      console.log('✅ authService: Profile response received');
      
      return response.data;
    } catch (error) {
      console.error('❌ authService: Get profile error:', error);
      console.error('❌ authService: Error response:', error.response?.data);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      console.log('🔄 authService: Updating profile...');
      
      const response = await api.put('/auth/profile', profileData);
      
      console.log('✅ authService: Profile update response received');
      
      return response.data;
    } catch (error) {
      console.error('❌ authService: Update profile error:', error);
      throw error;
    }
  },

  upgradeToSeller: async () => {
    try {
      console.log('🔄 authService: Upgrading to seller...');
      
      const response = await api.post('/auth/upgrade-seller');
      
      console.log('✅ authService: Upgrade to seller response received');
      
      return response.data;
    } catch (error) {
      console.error('❌ authService: Upgrade to seller error:', error);
      throw error;
    }
  },

  // Additional debug method
  checkAuth: async () => {
    try {
      console.log('🔄 authService: Checking authentication...');
      
      const token = localStorage.getItem('campusmart_token');
      console.log('🔑 authService: Current token:', token ? 'Exists' : 'Missing');
      
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('❌ authService: Auth check error:', error);
      throw error;
    }
  }
};