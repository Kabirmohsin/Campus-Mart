import User from '../models/User.js';
import { generateToken } from '../middleware/authMiddleware.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    console.log('🔄 Registration attempt for:', email);

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'buyer'
    });

    if (user) {
      const token = generateToken(user._id);
      
      console.log('✅ User registered successfully:', email);
      
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          campus: user.campus,
          rating: user.rating,
          totalSales: user.totalSales,
          totalOrders: user.totalOrders
        },
        token,
        message: 'Registration successful'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔄 Login attempt for:', email);

    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);
    
    console.log('✅ Login successful for:', email);

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        campus: user.campus,
        rating: user.rating,
        totalSales: user.totalSales,
        totalOrders: user.totalOrders,
        listedProducts: user.listedProducts
      },
      token,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// @desc    Upgrade to seller
// @route   POST /api/auth/upgrade-seller
// @access  Private
export const upgradeToSeller = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        role: 'seller',
        rating: 5.0,
        totalSales: 0,
        listedProducts: 0
      },
      { new: true }
    );

    res.json({
      success: true,
      user,
      message: 'Successfully upgraded to seller account'
    });
  } catch (error) {
    console.error('Upgrade to seller error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during upgrade'
    });
  }
};

// @desc    Check if user exists (for debugging)
// @route   POST /api/auth/check-user
// @access  Public
export const checkUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    res.json({
      success: true,
      exists: !!user,
      user: user ? {
        _id: user._id,
        email: user.email,
        name: user.name
      } : null
    });
  } catch (error) {
    console.error('Check user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking user'
    });
  }
};