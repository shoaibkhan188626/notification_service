import express from 'express';
import notificationRoutes from './routes/notification.route.js';
import loggerMiddleware from './middlewares/logger.middlware.js';
import errorHandler from './middlewares/ErrorHandler.js';

const app = express();

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