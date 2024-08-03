## Fleet Management Backend

### Project Overview

The Fleet Management Backend is a system designed to manage a fleet of vehicles, providing functionalities such as vehicle registration, real-time tracking, maintenance records management, and usage analytics. This backend service is built with NestJS and other modern technologies, providing a scalable and robust platform for managing vehicle data and operations efficiently.

### Features

- [x] Vehicle Registration
- [x] Vehicle Tracking
- [x] Vehicle Maintenance Records
- [x] Usage Analytics

## Tech Stack

### Core Technologies

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **MongoDB (Mongoose)**: A NoSQL database for storing vehicle data, maintenance records, and other information.
- **BullMQ**: A high-performance Node.js library for handling background jobs and message queues.
- **Swagger**: Used for API documentation and testing.

### Development Tools

- **TypeScript**: A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- **Jest**: A delightful JavaScript testing framework with a focus on simplicity.
- **ESLint**: A tool for identifying and fixing problems in your JavaScript/TypeScript code.
- **Prettier**: An opinionated code formatter that enforces a consistent style.
- **Supertest**: A library for testing HTTP servers.

## Architecture

### Overview

The Fleet Management Backend follows a modular architecture using NestJS. It is organized into several key modules that separate concerns and make the codebase easy to maintain and scale. Here's a high-level overview of the architecture:

1. **Modules**: Each feature (e.g., vehicle registration, tracking, maintenance) is encapsulated in its own module.
2. **Controllers**: Responsible for handling incoming requests and returning responses to the client.
3. **Services**: Implement business logic and interact with repositories for data access.
4. **Repositories**: Handle data access and persistence using Mongoose for MongoDB.
5. **Queues**: Used for handling asynchronous tasks and background processing with BullMQ.

### Key Components

- **Vehicle Module**: Manages vehicle registration and maintenance logs. Interfaces with the MongoDB database via Mongoose to persist vehicle data.

- **Tracking Module**: Provides real-time tracking of vehicle status and location. It also processes tracking data from simulated IoT devices. This module simulates data for demonstration purposes.

- **Queue Module**: This module is used to process IoT device data which is simulated using `./.scritps/iot-simulator.ts`

### Directory Structure

```plaintext
.
└── fleet-backend/
    ├── .scripts
    ├── src/
    │   └── modules/
    │       ├── queues/
    │       │   └── consumers
    │       ├── vehicle/
    │       │   ├── dtos
    │       │   └── models
    │       └── tracking/
    │           ├── dtos
    │           └── models
    └── test
```

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- yarn
- Docker

### Installation

1. **Clone the repository**:

   ```bash
   git clone git@github.com:jskod/fleet-backend.git
   cd fleet-backend
   ```

2. **Install dependencies**:

   ```bash
   yarn install
   ```

3. **Set up environment variables**:

   For this demo `.env` was committed to make it easy for testing purposes. Otherwise, '.env' should never be added to source control.

4. **Start the development server using Docker Compose**:

   ```bash
   docker-compose up --build
   ```

6. **Simulate IoT Device Data**:

   ```bash
   yarn run simulate:iot
   ```
   

## Database Seeding

For this demo, database seeding is performed at the time of Docker container creation. `.scripts/seed-db.js` is used to seed 10 vehicles that will also be used for IoT Data simulation script `.scripts/iot-simulator.ts`.

## API Documentation

The API documentation is generated using Swagger. Once the application is running, access the documentation at:

```
http://localhost:3000/docs
```