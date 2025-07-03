import express from 'express';
import notificationController from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/', notificationController.sendNotification);

export default router;