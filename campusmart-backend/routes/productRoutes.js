import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory
} from '../controllers/productController.js';
import { protect, isSeller } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// Protected routes
router.post('/', protect, isSeller, createProduct);
router.put('/:id', protect, isSeller, updateProduct);
router.delete('/:id', protect, isSeller, deleteProduct);

export default router;