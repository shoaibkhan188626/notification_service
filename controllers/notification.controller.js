import notificationService from '../services/notification.service.js';
import logger from '../config/logger.js';
import CustomError from '../utils/error.js';

const notificationController = {
  async sendNotification(req, res, next) {
    try {
      const { type, recipient, subject, message, externalId } = req.body;
      const notification = await notificationService.sendNotification({ type, recipient, subject, message, externalId });
      res.status(201).json({
        status: 'success',
        data: notification,
      });
    } catch (err) {
      logger.error(`Notification error: ${err.message}`);
      next(err);
    }
  },
};

export default notificationController;