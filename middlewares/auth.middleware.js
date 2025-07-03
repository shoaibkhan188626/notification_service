import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import logger from '../config/logger.js';

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please get a service key.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.SERVICE_KEY);
    // You might want to attach the decoded payload to req.user or req.service
    // req.service = decoded;
    next();
  } catch (err) {
    logger.error(`JWT verification error: ${err.message}`);
    return next(new AppError('Invalid service key. Please get a valid service key.', 401));
  }
};

export default protect;
