# Notification Service

The **Notification Service** is a microservice designed to handle notification-related operations for the healthcare ecosystem, integrated with the **Hospital Service** (`https://github.com/shoaibkhan188626/hospital-service.git`). It provides a RESTful API to send notifications (e.g., email, SMS) for events like hospital updates or doctor registrations, ensuring compliance with NDHM (National Digital Health Mission), DPDP Act (Digital Personal Data Protection Act), and Telemedicine Guidelines.

- **Repository**: [https://github.com/shoaibkhan188626/notification_service.git](https://github.com/shoaibkhan188626/notification_service.git)
- **Default Port**: `8081`
- **Base URL**: `http://localhost:8081` (for local development)
- **License**: MIT

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Service](#running-the-service)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Docker Support](#docker-support)
- [Compliance](#compliance)
- [Contributing](#contributing)
- [License](#license)

## Features

- Send notifications (email, SMS) for hospital-related events.
- Secure API with JWT authentication.
- Logger integration for audit trails.
- Dockerized for easy deployment.
- Unit tests for core functionality.

## Prerequisites

- **Node.js**: v18.x or later
- **npm**: v9.x or later
- **MongoDB**: Local instance or MongoDB Atlas
- **Docker**: For containerized setup (optional)
- **Git**: For cloning the repository

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shoaibkhan188626/notification_service.git
   cd notification_service
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=8081
MONGO_URI_LOCAL=mongodb://localhost:27017/notification_service
MONGO_URI_ATLAS=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/notification_service?retryWrites=true&w=majority
JWT_SECRET=your-secure-jwt-secret-32-chars
SERVICE_KEY=a7b9c2d8e4f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4
HOSPITAL_SERVICE_URL=http://localhost:8082
LOG_LEVEL=info
```

- Replace `<user>:<pass>` with your MongoDB Atlas credentials.
- `JWT_SECRET` and `SERVICE_KEY` must match the Hospital Service for inter-service authentication.
- `HOSPITAL_SERVICE_URL` points to the Hospital Service instance.

## Running the Service

### Local Development

1. Ensure MongoDB is running locally or via Docker.
2. Start the service:
   ```bash
   npm run dev
   ```

   - Uses `nodemon` to watch for file changes.
   - Expected output: `Server running on port 8081` in `logs/combined.log`.

### Production

1. Build the application:
   ```bash
   npm run build
   ```
2. Start the service:
   ```bash
   npm start
   ```

## API Endpoints

All endpoints require a `Authorization: Bearer <SERVICE_KEY_JWT>` header. Use the `generate-jwt.js` script to create the JWT (see `utils/generate-jwt.js`).

### Health Check

- **Method**: GET
- **URL**: `/health`
- **Headers**: None
- **Response**:
  - `200 OK`
  - Body: `{"status": "OK"}`

### Send Notification

- **Method**: POST
- **URL**: `/api/notifications`
- **Headers**:
  - `Authorization: Bearer <SERVICE_KEY_JWT>`
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "type": "email",
    "recipient": "user@example.com",
    "subject": "Hospital Update",
    "message": "A new hospital has been registered.",
    "externalId": "hospital-external-id"
  }
  ```
- **Response**:
  - `201 Created`
  - Body:
    ```json
    {
      "status": "success",
      "data": {
        "notificationId": "<uuid>",
        "type": "email",
        "recipient": "user@example.com",
        "subject": "Hospital Update",
        "message": "A new hospital has been registered.",
        "externalId": "hospital-external-id",
        "sentAt": "<timestamp>",
        "status": "pending"
      }
    }
    ```
  - Notes: `externalId` links to a Hospital Service entity (e.g., hospital `externalId`).

## Testing

1. Run unit tests:
   ```bash
   npm test
   ```

   - Uses Jest with MongoMemoryServer for in-memory MongoDB.
2. Run integration tests:
   ```bash
   node test-integration.js
   ```

   - Requires Hospital Service running at `http://localhost:8082`.

## Docker Support

1. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```
2. Verify the service:
   ```bash
   curl http://localhost:8081/health
   ```

## Compliance

- **NDHM**: Audit logs via Winston for health data traceability.
- **DPDP Act**: Soft deletion of notification records, minimal data retention.
- **Telemedicine Guidelines**: Supports hospital notification workflows.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m "Add feature-name"`.
4. Push to the branch: `git push origin feature-name`.
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
