import TableBooking from "../model/tableBooking.model.js";
import User from "../model/user.model.js";
import { sendMail } from "../services/emailService.js";

const tableBookingConfirmationTemplate = (bookingDetails) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale="1.0">
    <title>Table Booking Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            color: #333333;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            background-color: #FF6347;
            border-radius: 10px 10px 0 0;
            color: white;
        }
        .header h1 {
            font-size: 28px;
            margin: 0;
            color: white;
        }
        .body {
            font-size: 16px;
            line-height: 1.6;
            color: #555555;
            padding: 20px;
        }
        .booking-details {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .detail-row:last-child {
            margin-bottom: 0;
        }
        .footer {
            font-size: 12px;
            text-align: center;
            color: #888888;
            padding: 10px;
            background-color: #f2f2f2;
            border-radius: 0 0 10px 10px;
        }
        .footer a {
            color: #FF6347;
            text-decoration: none;
        }
        .emoji {
            font-size: 24px;
            margin-right: 5px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🍽️ Table Booking Confirmed!</h1>
            <p>Your table is reserved at Elysian Feast</p>
        </div>
        <div class="body">
            <p>Hello <strong>${bookingDetails.name}</strong>,</p>
            <p>Thank you for booking a table with us! Here are your booking details:</p>
            <div class="booking-details">
                <div class="detail-row">
                    <span><strong>Date:</strong></span>
                    <span>${bookingDetails.date}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Time:</strong></span>
                    <span>${bookingDetails.timeSlot}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Guests:</strong></span>
                    <span>${bookingDetails.guests}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Status:</strong></span>
                    <span>${bookingDetails.status}</span>
                </div>
                ${bookingDetails.specialRequest ? `
                <div class="detail-row">
                    <span><strong>Special Request:</strong></span>
                    <span>${bookingDetails.specialRequest}</span>
                </div>
                ` : ''}
            </div>
            <p>We look forward to serving you at Elysian Feast!</p>
        </div>
        <div class="footer">
            <p>🍽️ If you have any questions, feel free to <a href="mailto:support@elysianfeast.com">contact us</a>.</p>
            <p>Thank you for choosing <strong>Elysian Feast</strong>!</p>
        </div>
    </div>
</body>
</html>
`;

// Create a new table booking
export const createTableBooking = async (req, res) => {
  try {
    const { name, email, phone, date, timeSlot, guests, specialRequest } = req.body;
    const user = req.user._id;

    // Create and save the table booking
    const newBooking = new TableBooking({
      user,
      name,
      email,
      phone,
      date,
      timeSlot,
      guests: parseInt(guests),
      specialRequest,
    });

    const savedBooking = await newBooking.save();

    // Populate user details
    const populatedBooking = await TableBooking.findById(savedBooking._id)
      .populate("user", "firstName lastName email");

    // Send confirmation email
    const emailContent = tableBookingConfirmationTemplate({
      name: populatedBooking.name,
      date: populatedBooking.date,
      timeSlot: populatedBooking.timeSlot,
      guests: populatedBooking.guests,
      status: populatedBooking.status,
      specialRequest: populatedBooking.specialRequest,
    });

    try {
      await sendMail(populatedBooking.email, "Your Table Booking Confirmation", emailContent);
    } catch (emailError) {
      console.error("Failed to send booking confirmation email:", emailError.message);
      // Don't fail the booking if email fails
    }

    // Send success response
    res.status(201).json({
      success: true,
      message: "Table booking created successfully",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Error creating table booking:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all table bookings (for admin)
export const getAllTableBookings = async (req, res) => {
  try {
    const bookings = await TableBooking.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching table bookings:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch table bookings",
      error: error.message,
    });
  }
};

// Get user's table bookings
export const getUserTableBookings = async (req, res) => {
  try {
    const bookings = await TableBooking.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching user table bookings:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch table bookings",
      error: error.message,
    });
  }
};

// Get a specific table booking by ID
export const getTableBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await TableBooking.findById(id)
      .populate("user", "firstName lastName email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Table booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch table booking",
      error: error.message,
    });
  }
};

// Update table booking status
export const updateTableBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedBooking = await TableBooking.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Table booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Table booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update table booking status",
      error: error.message,
    });
  }
};

// Get table booking count
export const getTableBookingCount = async (req, res) => {
  try {
    const count = await TableBooking.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Error fetching table booking count:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch table booking count",
      error: error.message,
    });
  }
};

// Delete a table booking
export const deleteTableBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBooking = await TableBooking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({
        success: false,
        message: "Table booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Table booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete table booking",
      error: error.message,
    });
  }
};
