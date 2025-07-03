import mongoose from 'mongoose';
import logger from './logger.js';

export const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const uri = isProduction
    ? process.env.MONGO_URI_ATLAS
    : process.env.MONGO_URI_LOCAL;

  if (!uri) {
    const missingUriType = isProduction ? 'MONGO_URI_ATLAS' : 'MONGO_URI_LOCAL';
    throw new Error(
      `MongoDB URI (${missingUriType}) is not defined in environment variables.`
    );
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      // Other options can be added here for robustness, e.g., writeConcern, readPreference
    });
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};
