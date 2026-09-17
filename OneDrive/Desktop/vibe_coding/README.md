# Task Management App

A full-stack Kanban-style task management application for personal and team productivity. It uses a React dashboard, an Express REST API, PostgreSQL, and Prisma ORM.

## Features

- Three-column Kanban board: To-Do, In Progress, Done
- Drag and drop task status updates persisted through the backend API
- Task create, edit, delete, assignment, priority, due date, project, and status
- Project team membership management
- Server-side priority/status/project/user filtering
- Server-side workload calculation with overloaded user detection
- Red pulsing avatar when a user has more than 5 In Progress tasks
- Loading, error, retry, and empty states

## Tech Stack

Frontend: React, Vite, Tailwind CSS, Axios, `@dnd-kit/core`, `@dnd-kit/sortable`, lucide-react

Backend: Node.js, Express.js, Prisma, PostgreSQL, dotenv, CORS

## Architecture

```text
frontend/src/services/api.js       Centralized Axios API layer
frontend/src/pages/Dashboard.jsx   Main Kanban dashboard state and workflows
frontend/src/components/           Reusable UI components and modals

backend/src/routes/                REST route definitions
backend/src/controllers/           HTTP request/response handlers
backend/src/services/              Business logic and validation orchestration
backend/src/middleware/            Error and async middleware
backend/prisma/schema.prisma       Relational database schema
backend/prisma/seed.js             Demo seed data
```

The frontend never writes business rules directly to the database. It calls REST endpoints. The backend validates input, checks relationships, updates PostgreSQL through Prisma, and returns clean JSON.

## Database Schema

- `User`: name, email, avatar initials, assigned tasks, project memberships
- `Project`: name, description, tasks, members
- `Task`: title, description, priority, status, due date, project, assigned user
- `ProjectMember`: many-to-many join between users and projects

Enums:

- `Priority`: `LOW`, `MEDIUM`, `HIGH`
- `Status`: `TODO`, `IN_PROGRESS`, `DONE`

## API Endpoints

- `GET /api/health`
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/users/workload`
- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/projects/:id/members`
- `POST /api/projects/:id/members`
- `DELETE /api/projects/:id/members/:userId`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status`

Task filters:

```text
GET /api/tasks?priority=HIGH
GET /api/tasks?status=IN_PROGRESS
GET /api/tasks?projectId=1
GET /api/tasks?assignedUserId=2
```

## Environment Setup

Create `backend/.env` from `backend/.env.example`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/task_management"
PORT=5000
CLIENT_ORIGIN="http://localhost:5173,http://127.0.0.1:5173"
```

Optional frontend API override:

```env
VITE_API_URL="http://localhost:5000/api"
```

## Installation

```bash
npm run install:all
```

Or install separately:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Database Setup

Start PostgreSQL locally and create a database named `task_management`, then run:

```bash
cd backend
npx prisma generate
npx prisma migrate dev
npm run seed
```

Prisma Studio:

```bash
npx prisma studio
```

## Running Backend

```bash
cd backend
npm run dev
```

Backend URL: `http://localhost:5000`

## Running Frontend

```bash
cd frontend
npm run dev
```

Frontend URL: `http://localhost:5173`

Run both from the root:

```bash
npm run dev
```

## Example API Usage

Create a task:

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Plan sprint\",\"description\":\"Define sprint goals\",\"priority\":\"HIGH\",\"status\":\"TODO\",\"dueDate\":\"2026-09-25\",\"projectId\":1,\"assignedUserId\":1}"
```

Move a task:

```bash
curl -X PATCH http://localhost:5000/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"IN_PROGRESS\"}"
```

## Workload Balancing

The workload rule lives on the backend in `getWorkloads()`. For each user, the API counts tasks with status `IN_PROGRESS` and returns `isOverloaded`.

Rule:

```text
isOverloaded = inProgressCount > 5
```

Exactly 5 is not overloaded. 6 or more is overloaded. The frontend consumes `isOverloaded` from `/api/users/workload` and only renders the red pulsing avatar based on that server result.

Business logic belongs on the backend because it keeps the rule consistent for every client, protects database integrity, and makes the API the source of truth.

## Troubleshooting

- If Prisma cannot connect, verify `DATABASE_URL` and that PostgreSQL is running.
- If the frontend cannot load data, verify the backend is running on port `5000`.
- If CORS fails, confirm `CLIENT_ORIGIN` matches the frontend URL.
- If assignment fails, add the user to the project first.

## Repository

Requested repository: `https://github.com/himanxhuuu/Vibe_coding.git`
