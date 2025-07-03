import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  notificationId: { type: String, required: true, unique: true },
  type: { type: String, enum: ['email', 'sms'], required: true },
  recipient: { type: String, required: true },
  subject: { type: String, required: false },
  message: { type: String, required: true },
  externalId: { type: String, required: true }, // Links to Hospital Service entity
  sentAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  deleted: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export default mongoose.model('Notification', notificationSchema);