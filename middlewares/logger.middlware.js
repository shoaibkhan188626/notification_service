import logger from '../config/logger.js';

const loggerMiddleware = (req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
};

export default loggerMiddleware;