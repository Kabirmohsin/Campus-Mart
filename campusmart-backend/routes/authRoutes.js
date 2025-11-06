import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  upgradeToSeller
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/upgrade-seller', protect, upgradeToSeller);

export default router;