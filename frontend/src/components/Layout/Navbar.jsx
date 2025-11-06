import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, BookOpen, Menu, X, Store, ShoppingBag, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin, isSeller, isBuyer } = useAuth();
  const { getCartItemsCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleStartSelling = () => {
    if (user) {
      if (isSeller()) {
        navigate('/seller/dashboard');
      } else {
        navigate('/sell-product');
      }
    } else {
      navigate('/register');
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/contact', label: 'Contact' }, // ✅ Contact link add karein
    ...(user ? [{ path: '/my-orders', label: 'My Orders' }] : []),
  ];

  // ✅ Admin link ko separate rakhein for better visibility
  const adminLinks = isAdmin() ? [{ path: '/admin', label: 'Admin Dashboard' }] : [];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">CampusMart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Sell Button - Visible to all users */}
            <button
              onClick={handleStartSelling}
              className="hidden md:flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Store className="h-4 w-4" />
              <span className="font-medium">
                {user && isSeller() ? 'Dashboard' : 'Sell'}
              </span>
            </button>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                {/* Dashboard Links based on user role */}
                {isSeller() && (
                  <Link
                    to="/seller/dashboard"
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors duration-200 font-medium"
                  >
                    <Store className="h-4 w-4" />
                    <span className="text-sm">Seller</span>
                  </Link>
                )}
                {isBuyer() && (
                  <Link
                    to="/buyer/dashboard"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span className="text-sm">Buyer</span>
                  </Link>
                )}
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors duration-200 font-medium"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">Admin</span>
                  </Link>
                )}
                
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 p-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {/* Main Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                    location.pathname === link.path
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Admin Links (Mobile) */}
              {adminLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-md transition-colors duration-200"
                >
                  <Shield className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {/* Mobile Sell Button */}
              <button
                onClick={handleStartSelling}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                <Store className="h-4 w-4" />
                <span>{user && isSeller() ? 'Seller Dashboard' : 'Sell Item'}</span>
              </button>

              {/* Mobile Dashboard Links */}
              {user && (
                <>
                  {isSeller() && (
                    <Link
                      to="/seller/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200"
                    >
                      <Store className="h-4 w-4" />
                      <span>Seller Dashboard</span>
                    </Link>
                  )}
                  {isBuyer() && (
                    <Link
                      to="/buyer/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Buyer Dashboard</span>
                    </Link>
                  )}
                </>
              )}
              
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile ({user.name})</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700 transition-colors duration-200"
                  >
                    <User className="h-4 w-4" />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;