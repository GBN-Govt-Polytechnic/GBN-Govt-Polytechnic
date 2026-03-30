# Architecture — GBN Polytechnic V2

## 1. Purpose

This architecture document is the single source of truth for the GBN Government Polytechnic Nilokheri website rebuild (V2). It covers:
- service boundaries (frontend, admin, backend)
- runtime environment expectations
- data flow and security controls
- deployment requirements and production readiness

The old site repository under `gpnilokheri.ac.in/` is reference-only and not part of normal deployment.

---

## 2. Services Overview

Three separate apps communicate via REST and share a common database/storage layer.
Infrastructure (reverse proxy, SSL, managed DB) is handled externally to this repo.

```
Browser
  │
  ├── frontend/    (Next.js 16 · port 3000)      Public website
  │
  ├── admin/       (Next.js 16 · port 3001)      CMS (authenticated)
  │
  └── backend/     (Express.js 5 · port 4000)    API server
      ├── PostgreSQL (Prisma)
      └── MinIO S3  (AWS SDK)
```

### 2.1 frontend/

- Public website for students, faculty, and visitors.
- Source at `frontend/src/`.
- Uses Next.js App Router.
- Data fetching modes:
  - SSG for static content
  - ISR with `revalidate: 60` for news/events
  - Client-side fetch for interactive content
- API helper: `frontend/src/lib/api.ts`.
- No user authentication.
- Env: `frontend/.env.local` or `frontend/.env`.

### 2.2 admin/

- CMS for content and operations teams.
- Source at `admin/src/`.
- Authenticated pages only.
- JWT-based auth with refresh token.
- Role-based UI and access control.
- Hooks:
  - `admin/src/hooks/use-auth.tsx`
  - `admin/src/hooks/use-role.ts`
- Env: `admin/.env.local` or `admin/.env`.

### 2.3 backend/

- API between frontend/admin and database/storage.
- Source at `backend/src/`.
- Feature architecture: each module has routes/controller/service/schema.
- Prisma ORM with PostgreSQL via `backend/prisma/schema.prisma`.
- MinIO storage via `@aws-sdk/client-s3`.
- Key middleware in `backend/src/app.ts`:
  - `helmet` + custom CSP
  - `cors` restricted to `env.FRONTEND_URL`, `env.ADMIN_URL`
  - `morgan` (dev/short)
  - body parser 256k
  - global rate limiter
  - routes + error handler

---

## 3. Configuration and Environment Management

### 3.1 backend env validation

`backend/src/config/env.ts` validates required runtime config via Zod, and exits when invalid.

Required production-safe checks include:
- `NODE_ENV` in `development|production|test`
- `DATABASE_URL` is a URL
- `JWT_SECRET`, `JWT_REFRESH_SECRET`: min length 32 and not placeholders
- `MINIO_*` strong creds and no `minioadmin`
- `MINIO_USE_SSL` must be `true` in production
- SMTP credentials required in production

### 3.2 env files

- `backend/.env.example` — development sample
- `backend/.env` — local development, should never be committed to prod
- `.env.production.example` — production template
- `frontend/.env.example`, `admin/.env.example` — frontend/admin env samples
- `frontend/.env.local`, `admin/.env.local` — local runtime override

### 3.3 prod env keys

- `NODE_ENV=production`
- `DATABASE_URL` (managed DB host)
- `JWT_SECRET`, `JWT_REFRESH_SECRET` (generated securely)
- `MINIO_*` (secure, non-default)
- `FRONTEND_URL`, `ADMIN_URL` production domain(s)
- `SMTP_*` real transactional account
- `STORAGE_PUBLIC_URL` (optional CDN URL)

---

## 4. Backend Routes & Features

| Route Group | Purpose | Auth |
|---|---|---|
| `/api/auth` | login/refresh/password reset | public/protected |
| `/api/departments` | department CRUD/listing | protected |
| `/api/faculty` | faculty CRUD | protected |
| `/api/users` | admin user mgmt | protected (super admin) |
| `/api/news` | news, notices, circulars | protected |
| `/api/events` | event CRUD | protected |
| `/api/gallery` | gallery posts | protected |
| `/api/hero-slides` | hero slider | protected |
| `/api/courses` | courses | protected |
| `/api/labs` | labs | protected |
| `/api/study-materials` | file resources | protected |
| `/api/lesson-plans` | lesson plans | protected |
| `/api/syllabus` | syllabus | protected |
| `/api/timetables` | timetable | protected |
| `/api/placements` | placements | protected |
| `/api/contact-inquiries` | contact form submissions | public |
| `/api/complaints` | complaint form submissions | public |
| `/api/settings` | site settings | protected (admin/super admin) |
| `/api/audit-logs` | audit trail | protected (admin+) |
| `/api/results` | result entries | protected |
| `/api/mous` | MoU records | protected |
| `/api/achievements` | achievement entries | protected |
| `/api/notifications` | notifications | protected |
| `/api/dashboard` | admin dashboard stats | protected |
| `/api/sessions` | academic sessions | protected |

---

## 5. Security and Middleware

### 5.1 Authentication and authorization

- Access token: 15m
- Refresh token: 7d
- JWT claims: user id, role, department (for HOD)
- Refresh tokens stored in DB for revocation
- Passwords hashed with bcrypt
- Protected routes use `authenticate` + `requireRole` and optional `departmentScope`

### 5.2 Rate limiting

- global: 100 req/min
- strict: 5 req/min (sensitive operations)
- auth: 10 req/min (login, reset)

### 5.3 Input validation

All API inputs pass Zod validation in feature schemas and middleware.

### 5.4 Security headers

Helmet includes CSP:
- default-src 'self'
- script-src 'self'
- style-src 'self' 'unsafe-inline'
- img-src 'self' data: [STORAGE_PUBLIC_URL]
- connect-src 'self'
- frame-src 'none'
- object-src 'none'
- frame-ancestors 'none'

---

## 6. File Upload & Storage

- Multer for multipart uploads
- Files uploaded to MinIO via `@aws-sdk/client-s3`
- Upload path format `uploads/{category}/{uuid}.{ext}`
- URL persisted in DB and optionally served through CDN path
- Bucket is created/validated at startup from `ensureBucket()` in `backend/src/index.ts`

---

## 7. Data Flow Examples

### 7.1 Public faculty page

```
GET /departments/cse
  → frontend calls backend /api/departments/cse
  → backend loads data via Prisma with includes
  → returns JSON
  → frontend renders via ISR
```

### 7.2 Create news (admin)

```
POST /api/news
  → authenticate + requireRole(ADMIN,SUPER_ADMIN,NEWS_EDITOR)
  → validate payload with Zod
  → create in Prisma
  → write audit log
  → respond with created record
```

### 7.3 Contact form submission

```
POST /api/contact-inquiries
  → strict rate limit
  → validate body
  → store in DB
  → send email via Nodemailer
```

---

## 8. Project Structure

```
V2/
├── docs/
├── frontend/
│   ├── src/app/
│   ├── src/components/
│   ├── src/lib/
│   ├── package.json
├── admin/
│   ├── src/app/
│   ├── src/components/
│   ├── src/hooks/
│   ├── src/lib/
│   ├── package.json
├── backend/
│   ├── src/index.ts
│   ├── src/app.ts
│   ├── src/routes.ts
│   ├── src/config/env.ts
│   ├── src/middleware/
│   ├── src/features/
│   ├── src/services/
│   ├── src/utils/
│   ├── prisma/schema.prisma
│   ├── prisma/seed.ts
│   ├── package.json
├── gpnilokheri.ac.in/
├── docker-compose.yml
└── PLAN.md
```

---

## 9. Production readiness and known issues

- `backend/.env` should never be committed; remove and rotate credentials now.
- Ensure `.env` entries are in `.gitignore` for root/frontend/admin.
- Confirm `NODE_ENV=production`, `MINIO_USE_SSL=true`, and secure JWT & SMTP credentials in production.
- Add CI checks for env validation, lint, and tests.

---

## 10. Deploy commands (dev)

```
cd backend && bun install && bun run dev
cd frontend && bun install && bun run dev
cd admin && bun install && bun run dev

cd backend && bunx prisma migrate dev
cd backend && bunx prisma db seed
cd backend && bunx prisma studio
```

---

## 11. Reference docs

- `docs/SITEMAP.md`
- `docs/FEATURES.md`
- `docs/TODO.md`
- `docs/DEPLOYMENT.md`
