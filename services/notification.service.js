import { v4 as uuidv4 } from 'uuid';
import Notification from '../models/notification.js';
import logger from '../config/logger.js';
import AppError from '../utils/appError.js';

const sendEmail = async ({ recipient, subject, message }) => {
  // Placeholder for actual email sending logic (e.g., using Nodemailer, SendGrid, Mailgun)
  logger.info(`Simulating email send to ${recipient} with subject: ${subject}`);
  // In a real application, you would integrate with an email service provider here.
  // Example: await emailService.send({ to: recipient, subject, text: message });
  return { success: true, message: 'Email sent successfully (simulated)' };
};

const sendSms = async ({ recipient, message }) => {
  // Placeholder for actual SMS sending logic (e.g., using Twilio, Nexmo)
  logger.info(`Simulating SMS send to ${recipient} with message: ${message}`);
  // In a real application, you would integrate with an SMS service provider here.
  // Example: await smsService.send({ to: recipient, body: message });
  return { success: true, message: 'SMS sent successfully (simulated)' };
};

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
      let sendResult;
      if (type === 'email') {
        sendResult = await sendEmail({ recipient, subject, message });
      } else if (type === 'sms') {
        sendResult = await sendSms({ recipient, message });
      } else {
        throw new AppError('Invalid notification type', 400);
      }

      if (!sendResult.success) {
        throw new AppError(`Failed to send ${type} notification: ${sendResult.message}`, 500);
      }

      notification.status = 'sent';
      await notification.save();
      logger.info(`Notification ${notificationId} saved with status 'sent'`);
      return notification.toObject();
    } catch (error) {
      notification.status = 'failed';
      await notification.save(); // Attempt to save with failed status
      logger.error(`Failed to send or save notification ${notificationId}: ${error.message}`);
      // Re-throw as AppError if not already, or wrap generic errors
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(`Notification sending failed: ${error.message}`, 500);
      }
    }
  },

  async softDeleteNotification(notificationId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { notificationId: notificationId, deleted: false },
        { deleted: true },
        { new: true }
      );

      if (!notification) {
        throw new AppError('Notification not found or already deleted', 404);
      }

      logger.info(`Notification ${notificationId} soft-deleted.`);
      return notification;
    } catch (error) {
      logger.error(`Failed to soft-delete notification ${notificationId}: ${error.message}`);
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(`Failed to soft-delete notification: ${error.message}`, 500);
      }
    }
  },
};

export default notificationService;