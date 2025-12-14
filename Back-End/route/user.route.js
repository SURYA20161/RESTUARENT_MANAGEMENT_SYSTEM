import express from "express";
import passport from 'passport';
import { GoogleStrategyCustom } from '../config/passport.js';
import {
  signup,
  login,
  getUserCount,
  requestPasswordReset,
  resetPassword,
  updateUser,
  deleteUser,
  getAllUsers,
  verifyEmail,
  googleAuthCallback,
  getUserProfile,
  getUserOrders
} from "../controller/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.post("/signup", signup); // Signup a user
router.get("/verify-email/:token", verifyEmail);  //verify email
router.post("/login", login);   // Login a user
router.get("/count", getUserCount); // Get total user count
router.post("/request-reset", requestPasswordReset); // Request password reset
router.post("/reset--password", resetPassword); // Reset password
router.get("/all", getAllUsers); // New route for fetching all users

// Google OAuth Routes
router.get("/auth/google", passport.authenticate(GoogleStrategyCustom, { scope: ['profile', 'email'], session: false }));
router.get("/auth/google/callback", passport.authenticate(GoogleStrategyCustom, { failureRedirect: '/login', session: false }), googleAuthCallback);

// Protected Routes (authentication required)
router.get("/profile", verifyToken, getUserProfile); // Get user profile
router.get("/orders", verifyToken, getUserOrders); // Get user orders
router.put("/update/:id", verifyToken, updateUser); // Update user details
router.delete("/delete/:id", verifyToken, deleteUser); // Delete user

export default router;
