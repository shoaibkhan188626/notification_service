import notificationService from '../services/notification.service.js';
import logger from '../config/logger.js';

const notificationController = {
  async sendNotification(req, res, next) {
    try {
      const { type, recipient, subject, message, externalId } = req.body;
      const notification = await notificationService.sendNotification({
        type,
        recipient,
        subject,
        message,
        externalId,
      });
      res.status(201).json({
        status: 'success',
        data: notification,
      });
    } catch (err) {
      logger.error(`Notification controller error: ${err.message}`);
      next(err); // Pass the error to the global error handler
    }
  },

  async softDeleteNotification(req, res, next) {
    try {
      const { notificationId } = req.params;
      await notificationService.softDeleteNotification(notificationId);
      res.status(204).json({
        // 204 No Content for successful deletion
        status: 'success',
        data: null,
      });
    } catch (err) {
      logger.error(`Soft delete notification controller error: ${err.message}`);
      next(err);
    }
  },
};

export default notificationController;
