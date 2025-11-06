import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getSellerOrders // ✅ ADD THIS IMPORT
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All order routes require authentication

router.post('/', createOrder);
router.get('/user/my-orders', getUserOrders);
router.get('/seller/my-orders', getSellerOrders); // ✅ ADD THIS LINE
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);
router.post('/:id/cancel', cancelOrder);

// Admin only routes
router.get('/', authorize('admin'), getAllOrders);

export default router;