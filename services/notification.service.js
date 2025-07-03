import { v4 as uuidv4 } from 'uuid';
import Notification from '../models/notification.js';
import logger from '../config/logger.js';

const notificationService = {
  async sendNotification({ type, recipient, subject, message, externalId }) {
    const notificationId = uuidv4();
    const notification = new Notification({
      notificationId,
      type,
      recipient,
      subject,
      message,
      externalId,
    });

    try {
      // Placeholder for email/SMS sending logic
      logger.info(`Sending ${type} notification to ${recipient} for externalId ${externalId}`);
      await notification.save();
      return notification.toObject();
    } catch (error) {
      logger.error(`Failed to save notification: ${error.message}`);
      throw new Error('Notification sending failed');
    }
  },
};

export default notificationService;