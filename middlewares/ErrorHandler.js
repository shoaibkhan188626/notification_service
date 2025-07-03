import logger from '../config/logger.js';
import AppError from '../utils/appError.js';

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  logger.error(err);

  // Set default status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';

  // Handle specific error types
  if (err.name === 'CastError') {
    // Mongoose bad ObjectId
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}.`;
    err = new AppError(message, statusCode);
  } else if (err.code === 11000) {
    // Mongoose duplicate key error
    statusCode = 400;
    const value = err.keyValue
      ? Object.values(err.keyValue)[0]
      : 'duplicate value';
    message = `Duplicate field value: ${value}. Please use another value.`;
    err = new AppError(message, statusCode);
  } else if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    const errors = Object.values(err.errors).map((el) => el.message);
    message = `Invalid input data. ${errors.join('. ')}`;
    err = new AppError(message, statusCode);
  } else if (err.name === 'JsonWebTokenError') {
    // JWT invalid token
    statusCode = 401;
    message = 'Invalid token. Please log in again!';
    err = new AppError(message, statusCode);
  } else if (err.name === 'TokenExpiredError') {
    // JWT expired token
    statusCode = 401;
    message = 'Your token has expired! Please log in again.';
    err = new AppError(message, statusCode);
  }

  // Send error response
  res.status(statusCode).json({
    status: err.status || 'error',
    message: message,
    // Only send stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
