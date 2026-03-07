# IMPLEMENTATION_TASKS

Master implementation roadmap for the **Game Feedback & Bug Report System**. Tasks are grouped by domain and ordered for practical delivery.

---

## Database

### Task Title
Establish migration framework and baseline schema

**Goal**
Create a repeatable migration process and implement the initial PostgreSQL schema for reports, enums, and operational metadata.

**Files to modify**
- `database/migrations/001_create_enums.sql`
- `database/migrations/002_create_reports.sql`
- `database/migrations/003_indexes.sql`
- `database/README.md` (new)

**Expected result**
- Database can be initialized from scratch with a deterministic migration sequence.
- `report_type` and `report_status` enums exist.
- `reports` table and indexing strategy are applied successfully.

### Task Title
Add seed data for local development and QA

**Goal**
Provide realistic sample reports so frontend and backend features can be exercised immediately in non-production environments.

**Files to modify**
- `database/seeds/001_seed_sample_reports.sql`
- `database/README.md`

**Expected result**
- Developers can run a seed script to populate representative bug, suggestion, and balance reports.
- Seeded data supports filtering, status transitions, and dashboard demos.

### Task Title
Prepare future-ready user foundation

**Goal**
Create optional `users` table and role-ready schema extension to reduce future authentication migration risk.

**Files to modify**
- `database/migrations/004_create_users.sql` (new)
- `docs/architecture.md`

**Expected result**
- `users` table exists with unique email and role fields.
- Schema remains backward-compatible with current unauthenticated flows.

---

## Backend

### Task Title
Bootstrap Express application skeleton

**Goal**
Initialize backend runtime structure with environment config, app wiring, health route, and server bootstrap.

**Files to modify**
- `backend/package.json`
- `backend/src/server.js`
- `backend/src/app.js`
- `backend/src/config/env.js`
- `backend/src/shared/logger.js`

**Expected result**
- Backend starts reliably via npm scripts.
- Environment variables are validated at startup.
- `/api/health` endpoint returns service status.

### Task Title
Implement reports module with layered architecture

**Goal**
Deliver CRUD-adjacent report operations using routes/controllers/services/repositories with clear separation of concerns.

**Files to modify**
- `backend/src/modules/reports/report.routes.js`
- `backend/src/modules/reports/report.controller.js`
- `backend/src/modules/reports/report.service.js`
- `backend/src/modules/reports/report.repository.js`
- `backend/src/modules/reports/report.mapper.js`

**Expected result**
- Endpoints for create, list, detail, and status update are functional.
- Business rules (e.g., allowed status transitions) are centralized in service layer.
- Repository layer handles SQL execution and data mapping.

### Task Title
Add request validation and error normalization

**Goal**
Prevent malformed data from reaching business logic and provide consistent API error contracts.

**Files to modify**
- `backend/src/modules/reports/report.validation.js`
- `backend/src/middleware/validate.middleware.js`
- `backend/src/middleware/error.middleware.js`
- `backend/src/middleware/notFound.middleware.js`

**Expected result**
- Invalid payloads return structured 4xx errors.
- Unknown routes and unhandled exceptions return normalized error objects.
- Validation is reusable across route handlers.

### Task Title
Implement screenshot upload pipeline

**Goal**
Allow users to attach screenshots to reports with strict MIME type and file size checks.

**Files to modify**
- `backend/src/middleware/upload.middleware.js`
- `backend/src/modules/reports/report.controller.js`
- `backend/src/modules/reports/report.service.js`
- `backend/uploads/.gitkeep` (new)

**Expected result**
- Multipart report submissions with supported image formats succeed.
- Unsupported file types/sizes are rejected with clear errors.
- File metadata is stored alongside report records.

### Task Title
Add email notification service on report creation

**Goal**
Notify owner mailbox whenever a new report is submitted.

**Files to modify**
- `backend/src/config/mail.js`
- `backend/src/notifications/email.service.js`
- `backend/src/modules/reports/report.service.js`

**Expected result**
- Report creation triggers outbound email with key report details.
- Mail configuration is environment-driven and optional in local development.

### Task Title
Apply API hardening and operational middleware

**Goal**
Improve production readiness with CORS, security headers, request logging, and submit-route rate limiting.

**Files to modify**
- `backend/src/app.js`
- `backend/src/shared/constants.js`
- `backend/src/middleware/rateLimit.middleware.js` (new)
- `backend/.env.example`

**Expected result**
- Public API is protected by baseline security controls.
- CORS behavior is explicit and configurable.
- High-frequency abuse on report submission endpoint is throttled.

---

## Frontend

### Task Title
Initialize React app shell and routing foundation

**Goal**
Create the frontend baseline with routing, global layout, and environment-based API configuration.

**Files to modify**
- `frontend/package.json`
- `frontend/src/main.jsx`
- `frontend/src/app/App.jsx` (new)
- `frontend/src/app/router.jsx` (new)
- `frontend/.env.example`

**Expected result**
- Frontend runs locally with route scaffolding for public and admin experiences.
- API base URL is configurable by environment variables.

### Task Title
Build public report submission flow

**Goal**
Implement the player-facing form for feedback/bug submission with client validation and screenshot upload.

**Files to modify**
- `frontend/src/features/report-submit/ReportSubmitPage.jsx` (new)
- `frontend/src/features/report-submit/reportSubmit.schema.js` (new)
- `frontend/src/services/reportsApi.js`
- `frontend/src/components/form/*`

**Expected result**
- Users can submit title, description, type/tags, and optional metadata.
- Image upload works using `multipart/form-data`.
- UI shows loading, success, and error states.

### Task Title
Implement admin dashboard list and filters

**Goal**
Provide report management interface with filtering by status/type/date and paginated results.

**Files to modify**
- `frontend/src/features/admin-dashboard/AdminDashboardPage.jsx` (new)
- `frontend/src/features/admin-dashboard/ReportFilters.jsx` (new)
- `frontend/src/features/admin-dashboard/ReportTable.jsx` (new)
- `frontend/src/services/reportsApi.js`

**Expected result**
- Admin users can browse reports efficiently.
- Filter state syncs with API query parameters.
- Empty/error/loading states are handled gracefully.

### Task Title
Add admin detail view and status update actions

**Goal**
Enable detailed report inspection (including screenshot preview) and controlled status transitions.

**Files to modify**
- `frontend/src/features/admin-dashboard/ReportDetailDrawer.jsx` (new)
- `frontend/src/features/admin-dashboard/StatusChangeControl.jsx` (new)
- `frontend/src/components/StatusBadge.jsx` (new)
- `frontend/src/services/reportsApi.js`

**Expected result**
- Admin can open a report detail panel and view all metadata.
- Status updates are persisted via API and reflected immediately in UI.
- Status badges and tags are consistently styled.

### Task Title
Create shared UX states and error handling patterns

**Goal**
Standardize loading skeletons, inline validation messaging, and API error banners across major pages.

**Files to modify**
- `frontend/src/components/feedback/*`
- `frontend/src/utils/httpErrorMapper.js` (new)
- `frontend/src/styles/*`

**Expected result**
- Users receive consistent, understandable feedback for all common interactions.
- Reusable components reduce duplicated status-handling logic.

---

## Infrastructure

### Task Title
Define containerized local development stack

**Goal**
Provide one-command startup for database, backend, and frontend services.

**Files to modify**
- `docker-compose.yml`
- `backend/Dockerfile` (new)
- `frontend/Dockerfile` (new)
- `.dockerignore` (new)

**Expected result**
- Local stack boots with networking and environment defaults configured.
- Team members can run the application consistently across machines.

### Task Title
Document environment variables and setup workflows

**Goal**
Reduce onboarding friction and configuration mistakes through explicit environment documentation.

**Files to modify**
- `README.md`
- `backend/.env.example`
- `frontend/.env.example`
- `docs/deployment.md`

**Expected result**
- Required and optional environment variables are clearly explained.
- Local, staging, and production setup steps are documented.

### Task Title
Introduce CI pipeline for lint/test/build checks

**Goal**
Automate quality gates on every push and pull request.

**Files to modify**
- `.github/workflows/ci.yml` (new)
- `backend/package.json`
- `frontend/package.json`

**Expected result**
- CI validates backend/frontend linting, tests, and build steps.
- Regressions are detected before merge.

---

## Testing & Quality

### Task Title
Implement backend unit and integration test suites

**Goal**
Validate business rules, repository behavior, and API contracts for report workflows.

**Files to modify**
- `backend/tests/unit/report.service.test.js`
- `backend/tests/integration/report.api.test.js`
- `backend/tests/fixtures/*`
- `backend/package.json`

**Expected result**
- Core backend flows (create/list/detail/status update) are covered by automated tests.
- Error and edge cases are explicitly verified.

### Task Title
Implement frontend component and feature tests

**Goal**
Ensure report submission and admin management interactions remain stable during iteration.

**Files to modify**
- `frontend/src/features/report-submit/__tests__/ReportSubmitPage.test.jsx`
- `frontend/src/features/admin-dashboard/__tests__/AdminDashboardPage.test.jsx`
- `frontend/src/test/test-utils.jsx` (new)
- `frontend/package.json`

**Expected result**
- Key UI behavior is validated with realistic user interactions.
- Form validation and asynchronous API state transitions are test-covered.

### Task Title
Add end-to-end smoke tests for critical paths

**Goal**
Confirm that major user journeys work across integrated frontend/backend systems.

**Files to modify**
- `tests/e2e/report-submit.spec.ts` (new)
- `tests/e2e/admin-status-update.spec.ts` (new)
- `playwright.config.ts` (new)
- `package.json` (root, new or updated)

**Expected result**
- Automated E2E checks verify submit-report and update-status journeys.
- Smoke tests are runnable locally and in CI.

### Task Title
Enforce code quality standards and developer tooling

**Goal**
Establish linting, formatting, and commit quality checks to keep codebase maintainable.

**Files to modify**
- `.editorconfig` (new)
- `.eslintrc.*` / `eslint.config.*`
- `.prettierrc` (new)
- `.husky/*` (new)

**Expected result**
- Code style and static checks run consistently across contributors.
- Pre-commit/pre-push hooks catch common issues before they reach CI.

---

## Delivery sequencing recommendation

1. Database baseline + seed data
2. Backend foundation + reports API + uploads
3. Frontend submission flow
4. Frontend admin dashboard
5. Infrastructure automation (Docker + CI)
6. Comprehensive testing and quality guardrails
7. Optional user/auth-ready schema extensions
