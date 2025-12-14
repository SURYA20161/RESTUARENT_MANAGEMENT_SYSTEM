import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: function() {
      return !this.googleId; // Phone number required only if not a Google user
    },
    unique: true,
    sparse: true, // Allow multiple null values for Google users
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password required only if not a Google user
    },
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  address: {
    street: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    postalCode: {
      type: String,
      required: false,
    },
  },
  profilePicture: {
    type: String, // URL or path to the profile picture
    required: false,
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'], // Different roles for user management
    default: 'user',
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpiresAt: {
    type: Date,
  },
  // New fields for email verification
  isVerified: {
    type: Boolean,
    default: true, // Default is verified for localhost
  },
  verificationToken: {
    type: String, // Token for email verification
  },
  verificationTokenExpiresAt: {
    type: Date, // Expiration date for the token
  },
  googleId: {
    type: String, // Google ID for OAuth users
    required: false,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
