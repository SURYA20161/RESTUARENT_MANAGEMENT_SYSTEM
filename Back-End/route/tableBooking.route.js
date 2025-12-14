import express from "express";
import {
  createTableBooking,
  getAllTableBookings,
  getUserTableBookings,
  getTableBookingById,
  updateTableBookingStatus,
  deleteTableBooking,
  getTableBookingCount,
} from "../controller/tableBooking.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Table Booking routes
router.post("/create", verifyToken, createTableBooking); // Create a table booking
router.get("/all", verifyToken, getAllTableBookings); // Get all table bookings (admin)
router.get("/user", verifyToken, getUserTableBookings); // Get user's table bookings
router.get("/count", verifyToken, getTableBookingCount); // Count all table bookings

// Dynamic Routes
router.get("/:id", verifyToken, getTableBookingById); // Get table booking by ID
router.put("/:id/status", verifyToken, updateTableBookingStatus); // Update table booking status
router.delete("/:id", verifyToken, deleteTableBooking); // Delete a table booking

export default router;
