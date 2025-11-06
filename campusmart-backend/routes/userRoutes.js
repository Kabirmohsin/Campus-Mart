import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user profile
router.get('/profile', protect, (req, res) => {
  res.json({ 
    success: true, 
    user: req.user 
  });
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    // This is a placeholder - you can add actual profile update logic later
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// Get user orders (placeholder)
router.get('/orders', protect, (req, res) => {
  res.json({
    success: true,
    message: 'User orders route - implement later',
    orders: []
  });
});

export default router;