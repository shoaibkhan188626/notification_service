import express from 'express';
import notificationRoutes from './routes/notification.route.js';
import loggerMiddleware from './middlewares/logger.middlware.js';
import errorHandler from './middlewares/ErrorHandler.js';
import rateLimit from 'express-rate-limit';

const app = express();

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// Middleware
app.use(express.json());
app.use(loggerMiddleware);

// Routes
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling
app.use(errorHandler);

export default app;