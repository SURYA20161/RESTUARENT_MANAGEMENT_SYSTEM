import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurent');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    await db.collection('users').dropIndex('phoneNumber_1');
    console.log('Dropped index phoneNumber_1');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error dropping index:', error);
  }
};

dropIndex();
