import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('🔄 AuthContext: Initializing...');
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('campusmart_token');
      const userData = localStorage.getItem('campusmart_user');
      
      console.log('🔍 AuthContext: Checking auth status...');
      console.log('🔑 Token exists:', !!token);
      console.log('👤 User data exists:', !!userData);

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('📦 AuthContext: Parsed user data:', parsedUser);
          
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Verify token with backend
          await verifyToken();
        } catch (error) {
          console.error('❌ AuthContext: Error parsing user data:', error);
          await logout();
        }
      } else {
        console.log('🔍 AuthContext: No token or user data found');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ AuthContext: Error checking auth status:', error);
      setLoading(false);
    }
  };

  const verifyToken = async () => {
    try {
      console.log('🔄 AuthContext: Verifying token...');
      const result = await authService.getProfile();
      
      if (result.success) {
        console.log('✅ AuthContext: Token verified successfully');
        setUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem('campusmart_user', JSON.stringify(result.user));
      } else {
        throw new Error('Token verification failed');
      }
    } catch (error) {
      console.error('❌ AuthContext: Token verification failed:', error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔄 AuthContext: Attempting login...', { email });
      setLoading(true);
      
      const result = await authService.login(email, password);
      console.log('📦 AuthContext: Login API response:', result);
      
      if (result.success) {
        // Store token and user data
        localStorage.setItem('campusmart_token', result.token);
        localStorage.setItem('campusmart_user', JSON.stringify(result.user));
        
        // Update state
        setUser(result.user);
        setIsAuthenticated(true);
        
        console.log('✅ AuthContext: Login successful, user:', result.user);
        
        toast.success(`Welcome back, ${result.user.name}!`);
        return { success: true, user: result.user };
      } else {
        console.error('❌ AuthContext: Login failed in API response:', result.message);
        toast.error(result.message || 'Login failed');
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      console.error('❌ AuthContext: Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, role = 'buyer') => {
    try {
      console.log('🔄 AuthContext: Attempting registration...', { email: userData.email, role });
      setLoading(true);
      
      const registrationData = { 
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: role
      };
      
      const result = await authService.register(registrationData);
      console.log('📦 AuthContext: Registration API response:', result);
      
      if (result.success) {
        // Store token and user data
        localStorage.setItem('campusmart_token', result.token);
        localStorage.setItem('campusmart_user', JSON.stringify(result.user));
        
        // Update state
        setUser(result.user);
        setIsAuthenticated(true);
        
        console.log('✅ AuthContext: Registration successful, user:', result.user);
        
        toast.success(`Account created successfully! Welcome to CampusMart as a ${role}!`);
        return { success: true, user: result.user };
      } else {
        console.error('❌ AuthContext: Registration failed in API response:', result.message);
        toast.error(result.message || 'Registration failed');
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('❌ AuthContext: Registration error:', error);
      console.error('❌ AuthContext: Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🔄 AuthContext: Logging out...');
      await authService.logout();
    } catch (error) {
      console.error('❌ AuthContext: Logout API error:', error);
    } finally {
      // Clear all local storage
      localStorage.removeItem('campusmart_token');
      localStorage.removeItem('campusmart_user');
      localStorage.removeItem('campusmart_cart');
      localStorage.removeItem('campusmart_orders');
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('✅ AuthContext: Logout completed');
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      console.log('🔄 AuthContext: Updating profile...');
      const result = await authService.updateProfile(profileData);
      
      if (result.success) {
        const updatedUser = result.user;
        setUser(updatedUser);
        localStorage.setItem('campusmart_user', JSON.stringify(updatedUser));
        
        console.log('✅ AuthContext: Profile updated successfully');
        toast.success('Profile updated successfully');
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      console.error('❌ AuthContext: Update profile error:', error);
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const upgradeToSeller = async () => {
    try {
      console.log('🔄 AuthContext: Upgrading to seller...');
      const result = await authService.upgradeToSeller();
      
      if (result.success) {
        const updatedUser = result.user;
        setUser(updatedUser);
        localStorage.setItem('campusmart_user', JSON.stringify(updatedUser));
        
        console.log('✅ AuthContext: Upgrade to seller successful');
        toast.success('🎉 You are now a seller! Start listing your products.');
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      console.error('❌ AuthContext: Upgrade to seller error:', error);
      const errorMessage = error.response?.data?.message || 'Upgrade failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isSeller = () => user?.role === 'seller';
  const isBuyer = () => user?.role === 'buyer';

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      updateProfile,
      isAdmin,
      isSeller,
      isBuyer,
      upgradeToSeller,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};