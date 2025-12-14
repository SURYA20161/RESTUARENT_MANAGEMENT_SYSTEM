import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from './model/user.model.js';

dotenv.config();

const URI = process.env.MONGODB_URI;
const newPassword = 'admin123';

const updateAdmin = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Connected to MongoDB');

    let adminUser = await User.findOne({ email: 'ravichandransurya040@gmail.com' });
    if (!adminUser) {
      console.log('Admin user not found, creating new admin user');
      const hashPassword = await bcryptjs.hash(newPassword, 10);
      adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        phoneNumber: '1234567890',
        email: 'ravichandransurya040@gmail.com',
        password: hashPassword,
        dateOfBirth: new Date('1990-01-01'),
        role: 'admin',
        isVerified: true,
      });
      await adminUser.save();
      console.log('Admin user created successfully');
    } else {
      const hashPassword = await bcryptjs.hash(newPassword, 10);
      adminUser.password = hashPassword;
      await adminUser.save();
      console.log('Admin password updated successfully');
    }
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await mongoose.disconnect();
  }
};

updateAdmin();
