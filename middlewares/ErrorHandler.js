import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`);
  const statusCode = err.statusCode || 500;
  const response = {
    status: 'error',
    message: err.message,
    code: err.code || 'INTERNAL_SERVER_ERROR',
  };
  res.status(statusCode).json(response);
};

export default errorHandler;