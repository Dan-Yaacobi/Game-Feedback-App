# Game Feedback & Bug Report System

A modular full-stack web application for collecting player feedback, bug reports, and gameplay suggestions with screenshots and operational admin tooling.

## 1) Recommended Folder Structure

```text
Game-Feedback-App/
├─ frontend/                        # React app
│  ├─ src/
│  │  ├─ app/                       # App shell, routing, providers
│  │  ├─ components/                # Reusable UI components
│  │  ├─ features/
│  │  │  ├─ report-submit/          # Public report/feedback flow
│  │  │  └─ admin-dashboard/        # Admin report management UI
│  │  ├─ hooks/                     # Shared React hooks
│  │  ├─ services/                  # API clients
│  │  ├─ utils/                     # Shared utilities
│  │  ├─ styles/
│  │  └─ main.jsx
│  ├─ public/
│  ├─ .env.example
│  └─ package.json
│
├─ backend/                         # Node.js + Express API
│  ├─ src/
│  │  ├─ app.js                     # Express app wiring
│  │  ├─ server.js                  # HTTP bootstrap
│  │  ├─ config/
│  │  │  ├─ env.js                  # Env var validation/loading
│  │  │  ├─ db.js                   # PostgreSQL pool
│  │  │  └─ mail.js                 # SMTP transporter setup
│  │  ├─ modules/
│  │  │  └─ reports/
│  │  │     ├─ report.routes.js
│  │  │     ├─ report.controller.js
│  │  │     ├─ report.service.js
│  │  │     ├─ report.repository.js
│  │  │     ├─ report.validation.js
│  │  │     └─ report.mapper.js
│  │  ├─ middleware/
│  │  │  ├─ error.middleware.js
│  │  │  ├─ notFound.middleware.js
│  │  │  ├─ validate.middleware.js
│  │  │  └─ upload.middleware.js    # Multer config for screenshots
│  │  ├─ notifications/
│  │  │  └─ email.service.js        # Owner email notifications
│  │  ├─ shared/
│  │  │  ├─ constants.js
│  │  │  └─ logger.js
│  │  └─ utils/
│  ├─ uploads/                      # Local screenshot files
│  ├─ tests/
│  ├─ .env.example
│  └─ package.json
│
├─ database/
│  ├─ migrations/
│  │  ├─ 001_create_enums.sql
│  │  ├─ 002_create_reports.sql
│  │  └─ 003_indexes.sql
│  └─ seeds/
│     └─ 001_seed_sample_reports.sql
│
├─ docs/
│  ├─ architecture.md
│  ├─ api-spec.md
│  └─ deployment.md
│
├─ docker-compose.yml               # postgres + backend + frontend (optional)
├─ .gitignore
└─ README.md
```

## 2) Database Schema (PostgreSQL)

### Core table

```sql
CREATE TYPE report_type AS ENUM ('bug', 'suggestion', 'balance_issue');
CREATE TYPE report_status AS ENUM ('open', 'investigating', 'closed');

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  report_type report_type NOT NULL,
  status report_status NOT NULL DEFAULT 'open',

  -- Optional player metadata (authentication-ready)
  player_email VARCHAR(255),
  player_name VARCHAR(100),

  -- Screenshot metadata
  screenshot_path TEXT,
  screenshot_mime_type VARCHAR(100),
  screenshot_size_bytes BIGINT,

  -- Operational metadata
  source VARCHAR(50) DEFAULT 'web',
  priority SMALLINT,
  tags TEXT[] DEFAULT '{}',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);
```

### Helpful indexes

```sql
CREATE INDEX idx_reports_status ON reports (status);
CREATE INDEX idx_reports_type ON reports (report_type);
CREATE INDEX idx_reports_created_at ON reports (created_at DESC);
CREATE INDEX idx_reports_tags_gin ON reports USING GIN (tags);
```

### Optional future-ready table (for auth/user model)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(120),
  role VARCHAR(30) NOT NULL DEFAULT 'player',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 3) High-Level Architecture

### Frontend (React)

- Public report submission form:
  - Fields: title, description, type/tag, optional email/name, screenshot upload.
  - Client-side validation (required fields, max lengths, file type/size).
- Admin dashboard:
  - List reports with filters (type, status, date).
  - Detail view with screenshot preview.
  - Status change actions: open -> investigating -> closed.
- API integration:
  - `services/reportsApi.js` for REST calls.
  - Consistent response/error handling and loading states.

### Backend (Node.js + Express)

- Layered module pattern:
  - **Route**: endpoint declarations and middleware.
  - **Controller**: request/response orchestration.
  - **Service**: business rules (status transitions, notification triggers).
  - **Repository**: SQL/data access via PostgreSQL client.
- File uploads:
  - `multer` disk storage into `backend/uploads/`.
  - MIME and size validation.
- Notifications:
  - On report create, send owner email via SMTP (nodemailer).
- Validation:
  - Request schemas using `zod` or `joi` for body/query/params.
- Error handling:
  - Central error middleware and normalized API errors.

### Environment Variables

Backend:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/game_feedback
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=5
ALLOWED_IMAGE_MIME=image/png,image/jpeg,image/webp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
OWNER_EMAIL=owner@example.com
CLIENT_ORIGIN=http://localhost:5173
```

Frontend:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### REST API (initial)

- `POST /api/reports` - submit report (+ optional screenshot)
- `GET /api/reports` - admin list with filters/pagination
- `GET /api/reports/:id` - admin detail
- `PATCH /api/reports/:id/status` - update status
- `GET /api/health` - service health check

## 4) Implementation Steps

1. **Bootstrap repositories**
   - Initialize frontend and backend projects.
   - Add linting/formatting and base scripts.

2. **Database foundation**
   - Create PostgreSQL database.
   - Add migration scripts for enums/table/indexes.
   - Add a DB connection module and query helpers.

3. **Backend core setup**
   - Add Express app, router, middleware, and error handling.
   - Implement `reports` module with layered architecture.
   - Add schema validation for create/list/update payloads.

4. **Screenshot upload flow**
   - Configure multer for local disk storage.
   - Validate file type and file size.
   - Save file metadata in DB.

5. **Email notifications**
   - Configure nodemailer SMTP transport.
   - Send owner notification on report creation.
   - Keep email template logic isolated for future extensibility.

6. **Frontend report submission**
   - Build report form with client-side validation.
   - Support multipart/form-data upload.
   - Show success/error feedback states.

7. **Frontend admin dashboard**
   - Build table/list view with filtering and pagination.
   - Implement detail pane and status update actions.
   - Add clear status badges and tag chips.

8. **Cross-cutting concerns**
   - Environment variable management (`.env.example` for both apps).
   - Add CORS, request logging, and security headers.
   - Add rate limiting for public submit endpoint.

9. **Testing and quality checks**
   - Backend: unit tests (service), integration tests (API).
   - Frontend: component tests for form and dashboard interactions.
   - Add smoke checks for upload and status update paths.

10. **Prepare for authentication**
    - Introduce `users` table and role concepts (without full auth yet).
    - Add placeholders in API for auth middleware injection.
    - Ensure all admin routes are grouped for future protection.

## 5) End-to-End Local Integration Runbook

### Prerequisites

- Docker (for local PostgreSQL via `docker-compose`), or an existing PostgreSQL instance.
- Node.js 18+ and npm.
- `psql` CLI.

### Start PostgreSQL

From the repository root:

```bash
docker compose up -d postgres
```

### Configure environment files

Backend (`backend/.env`):

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/game_feedback
CLIENT_ORIGIN=http://localhost:5173
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=5
ALLOWED_IMAGE_MIME=image/png,image/jpeg,image/webp
```

Frontend (`frontend/.env`):

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### Run migrations with psql

```bash
psql postgresql://postgres:postgres@localhost:5432/game_feedback -f database/migrations/001_create_enums.sql
psql postgresql://postgres:postgres@localhost:5432/game_feedback -f database/migrations/002_create_reports.sql
psql postgresql://postgres:postgres@localhost:5432/game_feedback -f database/migrations/003_indexes.sql
```

### Start backend

```bash
cd backend
npm install
npm run dev
```

Health check:

```bash
curl http://localhost:4000/api/health
```

Expected response:

```json
{"status":"ok"}
```

### Start frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open:

- `http://localhost:5173`
- `http://localhost:5173/report`
- `http://localhost:5173/admin`

### Verify report submission workflow

1. Submit a report on `/report`.
2. Confirm request hits `POST /api/reports`.
3. Verify data in PostgreSQL:

```sql
SELECT id, title, report_type, status, screenshot_path, screenshot_mime_type
FROM reports
ORDER BY created_at DESC
LIMIT 10;
```

4. Open `/admin` and ensure the report appears in the list.
5. Open report details and verify screenshot preview loads.
6. Update status through transitions:
   - `open` → `investigating`
   - `investigating` → `closed`
7. Re-run SQL query to confirm status changes persisted.

## Vercel Deployment

### Local development

Run backend:

```bash
cd backend
npm run dev
```

Run frontend:

```bash
cd frontend
npm run dev
```

### Deployment steps

1. Push repository to GitHub.
2. Create a new project in Vercel.
3. Import the repository.
4. Set the following environment variables in Vercel:
   - `DATABASE_URL`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `OWNER_EMAIL`
5. Deploy.
