# Task Management System — Backend

A RESTful API built with **NestJS** and **TypeScript**, featuring JWT authentication, Prisma ORM, Zod validation, Swagger docs, and a Dockerized PostgreSQL database.

> Frontend: [task-management-system](https://github.com/starcrafter1345/task-management-system)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11, TypeScript |
| Database | PostgreSQL 17 (Docker) |
| ORM | Prisma 6 |
| Auth | JWT, Passport.js (local + JWT strategies), bcrypt |
| Validation | Zod, nestjs-zod |
| API Docs | Swagger (@nestjs/swagger) |
| Security | Helmet, cookie-parser |
| Testing | Jest, Supertest (unit + e2e) |
| Package manager | pnpm |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (for the database)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/starcrafter1345/task-management-system-nest.git
cd task-management-system-nest
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://prisma:prisma@localhost:5433/tests"

JWT_SECRET="your-secret-key"
JWT_EXPIRATION="7d"

NODE_ENV="development"
```

### 4. Start the database

```bash
docker-compose up -d
```

This starts a PostgreSQL 17 container on port **5433**.

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Start the application

```bash
# Development (watch mode)
pnpm run start:dev

# Standard development
pnpm run start

# Production
pnpm run start:prod
```

The API will be available at `http://localhost:3000`.

---

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api
```

---

## Project Structure

```
src/
├── auth/           # Authentication module (local + JWT strategies)
├── courses/        # Courses module
├── tasks/          # Tasks module (in progress)
├── prisma/         # Prisma service
└── main.ts         # App entry point
prisma/
└── schema.prisma   # Database schema
test/
└── *.e2e-spec.ts   # End-to-end tests
```

---

## Running Tests

```bash
# Unit tests
pnpm run test

# Unit tests in watch mode
pnpm run test:watch

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

> E2E tests use the Docker PostgreSQL instance. Make sure it's running before executing `test:e2e`.

---

## Available Scripts

| Script | Description |
|---|---|
| `pnpm run start` | Start in development mode |
| `pnpm run start:dev` | Start with file watching |
| `pnpm run start:prod` | Start in production mode |
| `pnpm run build` | Build for production |
| `pnpm run test` | Run unit tests |
| `pnpm run test:e2e` | Run end-to-end tests |
| `pnpm run test:cov` | Generate test coverage report |
| `pnpm run lint` | Lint and auto-fix |
| `pnpm run format` | Format code with Prettier |

---

## Roadmap

- [x] Auth module (register, login, JWT)
- [x] Courses module
- [x] E2E tests for auth and courses
- [ ] Tasks module
