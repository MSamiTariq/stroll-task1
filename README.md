# Dynamic Question Assignment System: Solution Overview

## Thought Process Behind the Solution

The primary goal was to design a system that dynamically assigns questions to users in different regions, ensuring that each region receives a unique question in every cycle. The challenges included handling time zone differences, configurable cycle durations, and scalability to support a large user base.

To tackle these challenges, I devised a solution that:

1. **Maintains Region-Specific Question Sets**: Each region has its own set of questions, acknowledging that questions may not be unique across regions.
2. **Implements Sequential Question Rotation**: Questions are assigned in a sequential order within each region, ensuring a new question is presented in each cycle.
3. **Handles Time Zones and Configurable Cycles**: The system calculates cycle start times based on each region's time zone and configuration settings.
4. **Ensures Scalability and Performance**: Leveraged caching with Redis and efficient database operations to support high concurrency and a large number of users.

## Compliance with Constraints and Considerations

- **Unique Question per Region per Cycle**: By maintaining a current question index for each region and rotating through the question set, the system ensures a unique question is assigned to each region in every cycle.
- **Configurable Cycle Durations and Start Times**: The cycle duration and start times are configurable per region, stored in the database, and used by the scheduler to calculate the next cycle.
- **Time Zone Handling**: Each region's time zone is stored and used to accurately schedule question rotations at the correct local time.
- **Scalability**: The system is designed to handle high traffic by using caching, connection pooling, and efficient queries.
- **Resilience**: Fail-safes and error handling are implemented to ensure consistent question assignments even in case of failures.

## Architecture Overview

- **Node.js Server with Express**: Serves API endpoints for users to retrieve current questions and for administrators to manage questions and configurations.
- **TypeScript and Prisma ORM**: Provides type safety and an intuitive way to interact with the PostgreSQL database.
- **PostgreSQL Database**: Stores regions, questions, configurations, and assignments.
- **Redis Cache**: Caches current questions per region to reduce database load and improve response times.
- **Scheduler**: Periodically rotates questions based on each region's configuration using `node-cron`.
- **Dockerized Services**: PostgreSQL and Redis are containerized for consistent and isolated environments, while the application runs locally for ease of development.

Here is an architecture diagram of the current system:
![Architecture Diagram](./architectureDiagram.png)

## Pros and Cons of the Architecture

### Pros

- **Flexibility**: Supports configurable cycles and accommodates different regional settings.
- **Scalability**: Designed to handle high user loads with caching and optimized database interactions.
- **Maintainability**: TypeScript and Prisma enhance code reliability and developer experience.
- **Time Zone Accuracy**: Proper handling of regional time zones ensures timely question rotations.

### Cons

- **Complexity**: Handling multiple regions with different configurations adds complexity to the scheduler.
- **Cache Invalidation**: Requires careful management to ensure cached data remains consistent with the database.
- **Single Point of Failure**: The scheduler needs to be carefully managed to prevent multiple instances causing conflicts in distributed environments.

## Potential Improvements

- **Distributed Scheduler**: Implement a distributed lock mechanism or use an external scheduler to manage the scheduler in a clustered environment.
- **Enhanced Error Handling**: Implement retry logic and alerting to handle failures more gracefully.
- **Monitoring and Analytics**: Integrate monitoring tools to track system performance and user engagement with questions.
- **Automated Testing**: Expand unit and integration tests to cover more scenarios and ensure system reliability.
- **Load Balancing**: Introduce load balancing for the API server to improve fault tolerance and scalability.

---
## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/MSamiTariq/stroll-task1.git
cd stroll-task1
```

### 2. Install Dependencies

Make sure you have Node.js and npm installed, then run:

```bash
npm install
```

### 3. Configure Environment Variables

Copy the `.env.example` file to `.env` and fill in the necessary environment variables:

```bash
cp .env.example .env
```

Update the `.env` file with the following values:

- `DATABASE_URL`: Connection string for PostgreSQL.
- `REDIS_HOST` and `REDIS_PORT`: Redis connection details.

Here is an example `.env` file:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=mysecretpassword
POSTGRES_DB=question_rotation
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?schema=public"

REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Run Docker Services

Start the PostgreSQL and Redis containers using Docker Compose:

```bash
docker-compose up -d
```

This will spin up both PostgreSQL and Redis services in the background.

### 5. Set Up the Database

Once PostgreSQL is running, initialize the database using Prisma migrations:

```bash
npx prisma migrate dev
```

### 6. Seed the Database

You can seed the database with some initial data (regions, questions, configurations) using the following command:

```bash
npm run seed
```

This will populate the database with the seed data defined in `prisma/seed.ts`.

### 7. Run the Application

Start the application in development mode:

```bash
npm run dev
```

This will start the Node.js server using `nodemon`, which watches for file changes and restarts the server automatically.

The application should now be running on `http://localhost:3000`.
