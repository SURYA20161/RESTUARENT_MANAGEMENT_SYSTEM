import express from 'express';
import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  getUserCartCount,
  clearCart,
} from '../controller/cart.controller.js';
import { verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post('/', verifyToken, addToCart); // Add product to cart
router.get('/count', verifyToken, getUserCartCount); // Get user's cart count
router.get('/:userId', verifyToken, getCart); // Get user's cart
router.put('/:productId', verifyToken, updateCart); // Update product quantity in cart
router.post("/remove", verifyToken, removeFromCart); // Remove product from cart
router.delete('/:userId', verifyToken, clearCart); // Clear entire cart


export default router;
