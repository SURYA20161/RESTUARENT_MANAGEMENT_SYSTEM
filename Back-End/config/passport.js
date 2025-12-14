import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../model/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret";

// Custom Google Strategy that doesn't use sessions
const GoogleStrategyCustom = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/user/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // User exists, return user
        return done(null, user);
      }

      // Check if user exists with same email
      user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // User exists with email, link Google ID
        user.googleId = profile.id;
        await user.save();
        return done(null, user);
      }

      // Create new user
      const newUser = new User({
        googleId: profile.id,
        firstName: profile.name.givenName || '',
        lastName: profile.name.familyName || '',
        email: profile.emails[0].value,
        isVerified: true, // Google accounts are pre-verified
        role: profile.emails[0].value === 'ravichandransurya040@gmail.com' ? 'admin' : 'user',
      });

      await newUser.save();
      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }
);

// Export the strategy for use in routes
export { GoogleStrategyCustom };
export default passport;
