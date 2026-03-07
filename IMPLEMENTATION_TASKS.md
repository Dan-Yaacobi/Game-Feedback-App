# Implementation Task Breakdown

## Database

### Task Title
Design feedback schema and initial migration

### Goal
Create the first database structure for storing game feedback submissions and prepare the app for future querying.

### Files to modify
- `database/schema.sql`
- `database/migrations/001_create_feedback_table.sql`
- `README.md`

### Expected result
A repeatable migration exists that creates a `feedback` table (id, player_name, rating, comments, created_at), and the README explains how to apply the migration.

---

### Task Title
Add seed data for local development

### Goal
Provide sample feedback records so developers can quickly verify app behavior in local and test environments.

### Files to modify
- `database/seeds/feedback_seed.sql`
- `README.md`

### Expected result
Developers can load seed data and immediately see realistic feedback entries in the app.

---

## Backend

### Task Title
Create feedback submission endpoint

### Goal
Implement an API route to accept and persist feedback form submissions.

### Files to modify
- `backend/routes/feedback.js`
- `backend/controllers/feedbackController.js`
- `backend/services/feedbackService.js`

### Expected result
A `POST /api/feedback` endpoint validates input and stores feedback in the database with clear success/error responses.

---

### Task Title
Create feedback listing endpoint

### Goal
Expose a read endpoint for fetching submitted feedback entries for internal review.

### Files to modify
- `backend/routes/feedback.js`
- `backend/controllers/feedbackController.js`
- `backend/services/feedbackService.js`

### Expected result
A `GET /api/feedback` endpoint returns paginated feedback records sorted by newest first.

---

### Task Title
Add backend validation and tests for feedback API

### Goal
Ensure invalid feedback payloads are rejected and happy paths remain stable through automated tests.

### Files to modify
- `backend/validators/feedbackValidator.js`
- `backend/tests/feedback.api.test.js`

### Expected result
Validation covers required fields and value ranges; API tests pass for both valid and invalid requests.

---

## Frontend

### Task Title
Build feedback submission form UI

### Goal
Create a simple, accessible form for players to submit ratings and comments.

### Files to modify
- `frontend/src/components/FeedbackForm.jsx`
- `frontend/src/styles/feedback-form.css`
- `frontend/src/App.jsx`

### Expected result
Users can enter name, rating, and comments in a validated form with clear field-level errors.

---

### Task Title
Connect form to backend API

### Goal
Wire the frontend form to the feedback submission endpoint with loading and success/error feedback.

### Files to modify
- `frontend/src/components/FeedbackForm.jsx`
- `frontend/src/api/feedbackApi.js`

### Expected result
Submitting the form sends data to `POST /api/feedback`, shows loading state, and displays confirmation/error messages.

---

### Task Title
Build feedback list view for admins/internal users

### Goal
Provide a page or section to display submitted feedback items from the backend.

### Files to modify
- `frontend/src/components/FeedbackList.jsx`
- `frontend/src/api/feedbackApi.js`
- `frontend/src/App.jsx`

### Expected result
A readable list of feedback is shown with rating, comment snippet, and submission date.

---

## Infrastructure

### Task Title
Add environment configuration templates

### Goal
Standardize required environment variables for local setup and deployment.

### Files to modify
- `.env.example`
- `README.md`

### Expected result
A documented `.env.example` includes database URL, API port, and frontend API base URL settings.

---

### Task Title
Add containerized local development setup

### Goal
Enable one-command startup for app dependencies (at minimum database) to reduce setup friction.

### Files to modify
- `docker-compose.yml`
- `README.md`

### Expected result
Developers can start local dependencies with Docker Compose and run the app consistently.

---

### Task Title
Add CI checks for linting and tests

### Goal
Prevent regressions by automatically running quality checks on pull requests.

### Files to modify
- `.github/workflows/ci.yml`
- `backend/package.json`
- `frontend/package.json`

### Expected result
CI runs lint and test commands for backend/frontend on every pull request and reports status.
