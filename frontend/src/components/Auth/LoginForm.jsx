import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../Layout/LoadingSpinner';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Check if coming from seller intent
  const isSellerIntent = searchParams.get('intent') === 'seller';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // ✅ DIRECTLY use result.user.role for redirect - no need to wait for state update
        console.log('🔐 LOGIN DEBUG:');
        console.log('Login successful, user:', result.user);
        console.log('User role:', result.user?.role);
        console.log('Seller Intent:', isSellerIntent);

        // Role-based redirect with seller intent priority
        if (result.user?.role === 'admin') {
          console.log('🔄 Redirecting to admin dashboard');
          navigate('/admin');
        } else if (result.user?.role === 'seller' || isSellerIntent) {
          console.log('🔄 Redirecting to seller dashboard');
          navigate('/seller/dashboard');
        } else if (result.user?.role === 'buyer') {
          console.log('🔄 Redirecting to buyer dashboard');
          navigate('/buyer/dashboard');
        } else {
          console.log('🔄 Redirecting to home');
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@campusmart.com', password: 'admin123', role: 'Admin' },
    { email: 'seller@campusmart.com', password: 'seller123', role: 'Seller' },
    { email: 'buyer@campusmart.com', password: 'buyer123', role: 'Buyer' }
  ];

  const fillDemoAccount = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Seller Intent Banner */}
      {isSellerIntent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🏪</div>
            <div>
              <h3 className="font-semibold text-green-800">Seller Login</h3>
              <p className="text-sm text-green-700 mt-1">
                You'll be redirected to seller dashboard after login
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Accounts:</h4>
          <div className="space-y-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillDemoAccount(account.email, account.password)}
                className="w-full text-left p-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">{account.role}</div>
                <div className="text-gray-600">{account.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <LoadingSpinner size="small" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to={isSellerIntent ? "/register?role=seller" : "/register"}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;