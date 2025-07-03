import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Notification from '../models/notification.js';
import jwt from 'jsonwebtoken';

let mongoServer;
let serviceKeyJwt;

// Generate a JWT for testing
const generateServiceKeyJwt = () => {
  const payload = { service: 'notification-service-test' };
  const secret = process.env.SERVICE_KEY || 'your-secure-service-key-for-tests'; // Use a test secret
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  process.env.SERVICE_KEY = 'your-secure-service-key-for-tests'; // Set a test service key
  serviceKeyJwt = generateServiceKeyJwt();
});

afterEach(async () => {
  await Notification.deleteMany({}); // Clean up after each test
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Health Check', () => {
  test('should return 200 OK for health check', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ status: 'OK' });
  });
});

describe('Notification API', () => {
  test('should send a new email notification with valid data', async () => {
    const res = await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${serviceKeyJwt}`)
      .send({
        type: 'email',
        recipient: 'test@example.com',
        subject: 'Test Email',
        message: 'This is a test email.',
        externalId: 'hospital-123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toEqual('success');
    expect(res.body.data).toHaveProperty('notificationId');
    expect(res.body.data.type).toEqual('email');
    expect(res.body.data.recipient).toEqual('test@example.com');
  });

  test('should send a new SMS notification with valid data', async () => {
    const res = await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${serviceKeyJwt}`)
      .send({
        type: 'sms',
        recipient: '+15551234567',
        message: 'This is a test SMS.',
        externalId: 'hospital-456',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toEqual('success');
    expect(res.body.data).toHaveProperty('notificationId');
    expect(res.body.data.type).toEqual('sms');
    expect(res.body.data.recipient).toEqual('+15551234567');
  });

  test('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${serviceKeyJwt}`)
      .send({
        type: 'email',
        recipient: 'test@example.com',
        // subject is missing
        message: 'This is a test email.',
        externalId: 'hospital-123',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.status).toEqual('fail');
    expect(res.body.message).toContain('"subject" is required');
  });

  test('should return 401 if no authorization token is provided', async () => {
    const res = await request(app)
      .post('/api/notifications')
      .send({
        type: 'email',
        recipient: 'test@example.com',
        subject: 'Test Email',
        message: 'This is a test email.',
        externalId: 'hospital-123',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual('fail');
    expect(res.body.message).toContain('You are not logged in!');
  });

  test('should return 401 if an invalid authorization token is provided', async () => {
    const res = await request(app)
      .post('/api/notifications')
      .set('Authorization', 'Bearer invalidtoken')
      .send({
        type: 'email',
        recipient: 'test@example.com',
        subject: 'Test Email',
        message: 'This is a test email.',
        externalId: 'hospital-123',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual('fail');
    expect(res.body.message).toContain('Invalid service key.');
  });

  test('should soft delete a notification', async () => {
    const notification = new Notification({
      type: 'email',
      recipient: 'delete@example.com',
      subject: 'Delete Test',
      message: 'This notification will be soft deleted.',
      externalId: 'delete-123',
    });
    await notification.save();

    const res = await request(app)
      .delete(`/api/notifications/${notification.notificationId}`)
      .set('Authorization', `Bearer ${serviceKeyJwt}`);

    expect(res.statusCode).toEqual(204);

    const deletedNotification = await Notification.findOne({ notificationId: notification.notificationId }).select('+deleted');
    expect(deletedNotification.deleted).toBe(true);
  });

  test('should return 404 if notification to delete is not found', async () => {
    const res = await request(app)
      .delete('/api/notifications/nonexistent-id')
      .set('Authorization', `Bearer ${serviceKeyJwt}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.status).toEqual('fail');
    expect(res.body.message).toContain('Notification not found or already deleted');
  });
});
