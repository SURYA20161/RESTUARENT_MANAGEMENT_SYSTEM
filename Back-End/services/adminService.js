import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from '../model/user.model.js';

const createOrUpdateAdmin = async () => {
  try {
    const adminEmail = 'ravichandransurya040@gmail.com';
    const adminPassword = 'admin123';

    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      console.log('Admin user not found, creating new admin user');
      const hashPassword = await bcryptjs.hash(adminPassword, 10);
      adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        phoneNumber: '1234567890',
        email: adminEmail,
        password: hashPassword,
        dateOfBirth: new Date('1990-01-01'),
        role: 'admin',
        isVerified: true,
      });
      await adminUser.save();
      console.log('Admin user created successfully');
    } else {
      const hashPassword = await bcryptjs.hash(adminPassword, 10);
      adminUser.password = hashPassword;
      await adminUser.save();
      console.log('Admin password updated successfully');
    }
  } catch (error) {
    console.error('Error creating or updating admin user:', error);
  }
};

export default createOrUpdateAdmin;
