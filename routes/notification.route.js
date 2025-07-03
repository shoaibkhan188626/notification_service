import express from 'express';
import notificationController from '../controllers/notification.controller.js';
import Joi from 'joi';
import AppError from '../utils/appError.js';
import protect from '../middlewares/auth.middleware.js';

const router = express.Router();

const notificationSchema = Joi.object({
  type: Joi.string().valid('email', 'sms').required(),
  recipient: Joi.string().required(),
  subject: Joi.string().when('type', {
    is: 'email',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  message: Joi.string().required(),
  externalId: Joi.string().required(),
});

const validateNotification = (req, res, next) => {
  const { error } = notificationSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};

router.post(
  '/',
  protect,
  validateNotification,
  notificationController.sendNotification
);
router.delete(
  '/:notificationId',
  protect,
  notificationController.softDeleteNotification
);

export default router;
