import logger from '../config/logger.js';

const loggerMiddleware = (req, res, next) => {
  const logData = {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString(),
  };
  logger.info('Request', logData);
  next();
};

export default loggerMiddleware;
