import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const notificationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4, // Automatically generate UUID if not provided
    },
    type: {
      type: String,
      enum: ['email', 'sms'],
      required: [true, 'Notification type is required'],
    },
    recipient: {
      type: String,
      required: [true, 'Recipient is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          // Basic validation for email or phone number based on type
          if (this.type === 'email') {
            return /^\S+@\S+\.\S+$/.test(v);
          } else if (this.type === 'sms') {
            return /^\+?[1-9]\d{1,14}$/.test(v); // E.164 format for phone numbers
          }
          return false;
        },
        message: (props) =>
          `${props.value} is not a valid recipient for type ${props.path}!`,
      },
    },
    subject: {
      type: String,
      required: function () {
        return this.type === 'email';
      }, // Subject is required only for email
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    externalId: {
      type: String,
      required: [true, 'External ID is required'], // Links to Hospital Service entity
      trim: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
    deleted: {
      type: Boolean,
      default: false,
      select: false, // Do not return by default in queries
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries
notificationSchema.index({ externalId: 1 });
notificationSchema.index({ recipient: 1, type: 1 });

export default mongoose.model('Notification', notificationSchema);
