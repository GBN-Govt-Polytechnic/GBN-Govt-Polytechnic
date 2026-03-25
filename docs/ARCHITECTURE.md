# Architecture — GBN Polytechnic V2

## 1. Services Overview

Three apps communicating via REST. DevOps/infra is handled separately — docs here cover only the code layer.

```
Browser
  │
  ├── frontend/    (Next.js 16 · Port 3000)
  │   Public website — SSR/SSG/ISR, API calls to backend
  │   No authentication — fully public
  │
  ├── admin/       (Next.js 16 · Port 3001)
  │   CMS / admin panel — authenticated, role-gated CRUD
  │   JWT tokens stored in localStorage with auto-refresh
  │
  └── backend/     (Express.js 5 · Port 4000)
      REST API, custom JWT auth, file uploads, email, DB
      │
      ├── PostgreSQL   (via Prisma ORM)
      └── MinIO S3     (via @aws-sdk/client-s3 — local Docker container)
```

---

## 2. Tech Stack

### 2.1 frontend/ — Main Site (Public)

| | |
|---|---|
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Icons** | Lucide React |
| **Package Manager** | Bun |
| **Dev Port** | 3000 |

**Key dependencies:** `next`, `react`, `tailwindcss`, `lucide-react`, `radix-ui`

**Responsibilities:**
- Server-rendered pages (SSR/SSG/ISR with 60s revalidation)
- Client-side interactivity (sliders, galleries, forms)
- Calls `backend` API for all dynamic data via typed `lib/api.ts` wrapper
- No authentication — frontend is entirely public-facing

---

### 2.2 admin/ — CMS Admin Panel

| | |
|---|---|
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Package Manager** | Bun |
| **Dev Port** | 3001 |

**Key dependencies:** `next`, `react`, `tailwindcss`, `shadcn/ui`, `radix-ui`, `sonner`, `next-themes`

**Responsibilities:**
- Authenticated access only — redirect to login if no valid JWT
- Role-based UI: Super Admin, Admin, HOD, TPO, Media Manager, News Editor
- CRUD forms for all dynamic content
- File uploads (PDF, images) sent through backend API
- Dashboard with key stats

**Role Permissions:**

| Role | Scope |
|------|-------|
| Super Admin | Full access + user management + site settings |
| Admin | News, gallery, events, results, admissions, committees, documents, tenders |
| HOD | Own dept: faculty, study materials, lesson plans, syllabus, timetable |
| TPO | Placement records, companies, industry inquiries |
| Media Manager | Gallery, hero slides, events |
| News Editor | News/notices, circulars |

---

### 2.3 backend/ — API Server

| | |
|---|---|
| **Framework** | Express.js 5 (TypeScript) |
| **ORM** | Prisma 6 |
| **Database** | PostgreSQL |
| **Auth** | Custom JWT — `jsonwebtoken` + `bcryptjs` |
| **File Storage** | MinIO via `@aws-sdk/client-s3` |
| **Package Manager** | Bun |
| **Dev Port** | 4000 |

**Key dependencies:**
```
express              REST API framework
@prisma/client       DB access (PostgreSQL)
jsonwebtoken         JWT sign/verify
bcryptjs             Password hashing
zod                  Schema validation (every endpoint)
multer               Multipart file upload parsing
@aws-sdk/client-s3   Upload files to MinIO/S3-compatible storage
nodemailer           Email notifications via SMTP
helmet               HTTP security headers
cors                 Cross-origin requests
rate-limiter-flexible  Rate limiting (3 tiers)
morgan               Request logging
```

**Responsibilities:**
- All REST endpoints (public + authenticated)
- Custom auth: login, token refresh, password reset
- JWT verification middleware on protected routes
- RBAC middleware — role checks per route with department scoping for HODs
- Form submissions (contact, complaints)
- File upload: Multer → MinIO bucket → store URL in DB
- Email via Nodemailer + SMTP
- Rate limiting: global (100/min), strict (5/min), auth (10/min)
- Input validation with Zod on every endpoint

---

## 3. Entry Points & Request Flow

### Backend startup sequence
```
backend/src/index.ts          ← Entry point (Bun runs this)
  → import app from app.ts    ← Express app with middleware stack
  → ensureBucket()            ← Creates MinIO bucket if missing
  → app.listen(PORT)          ← Start HTTP server

backend/src/app.ts            ← Middleware stack (order matters)
  1. trust proxy              ← For correct req.ip behind nginx
  2. helmet                   ← Security headers + CSP
  3. cors                     ← Allow frontend:3000 + admin:3001
  4. morgan                   ← Request logging
  5. express.json (256kb)     ← Body parser
  6. globalLimiter            ← 100 req/min per IP
  7. GET /api/health          ← Health check
  8. /api/* → routes.ts       ← All feature routes
  9. errorHandler             ← Global error catch

backend/src/routes.ts         ← Central route registry
  /api/auth/*                 ← Login, refresh, password reset
  /api/departments/*          ← Department CRUD
  /api/faculty/*              ← Faculty CRUD
  /api/users/*                ← Admin user management
  /api/news/*                 ← News/notices CRUD
  /api/events/*               ← Events CRUD
  /api/gallery/*              ← Gallery albums/images
  /api/hero-slides/*          ← Homepage hero slider
  /api/courses/*              ← Course listings
  /api/labs/*                 ← Lab details
  /api/study-materials/*      ← Study material files
  /api/lesson-plans/*         ← Lesson plan files
  /api/syllabus/*             ← Syllabus files
  /api/timetables/*           ← Timetable files
  /api/placements/*           ← Placement records/companies/activities
  /api/contact-inquiries      ← Contact form submissions (via submissions)
  /api/complaints             ← Complaint form submissions (via submissions)
  /api/settings/*             ← Site settings
  /api/audit-logs/*           ← Audit log viewer
  /api/results/*              ← Exam results
  /api/mous/*                 ← MoU records
  /api/achievements/*         ← Achievement records
  /api/notifications/*        ← Notification system
  /api/dashboard/*            ← Admin dashboard stats
  /api/sessions/*             ← Academic session management
```

### Frontend request flow
```
Browser → Next.js page (SSR/SSG)
  → lib/api.ts request() → fetch(NEXT_PUBLIC_API_URL + path)
  → Backend responds with JSON
  → Next.js renders HTML → sent to browser
  → ISR revalidates every 60 seconds
```

### Admin request flow
```
Browser → Admin login page
  → POST /api/auth/login → receives { accessToken, refreshToken }
  → Tokens stored in localStorage
  → AuthProvider (use-auth.tsx) manages state
  → All API calls include Authorization: Bearer <accessToken>
  → On 401 → auto-refresh via refreshToken → retry
  → Role mapped: SUPER_ADMIN/ADMIN → "admin", HOD → "hod", etc.
```

---

## 4. Auth Flow

Custom JWT — no third-party auth service. Admin-only (no student/alumni auth).

```
POST /api/auth/login
  → Zod validate email + password
  → Prisma: find AdminUser by email
  → bcrypt.compare(password, hash)
  → Sign accessToken  { userId, role }  (15 min)
  → Sign refreshToken { userId }        (7 days, stored in DB)
  ← { accessToken, refreshToken, user }

Admin app:
  accessToken  → localStorage (auto-refreshed)
  refreshToken → localStorage

Protected routes:
  → authenticate middleware: verify accessToken
  → requireRole(role): check req.user.role against allowed roles
  → departmentScope: restrict HODs to their own department
  → Attach req.user = { id, role, departmentId }
```

**Role hierarchy:** `SUPER_ADMIN > ADMIN > HOD > TPO > MEDIA_MANAGER > NEWS_EDITOR`

---

## 5. File Storage Flow

MinIO S3-compatible storage running in Docker. Bucket auto-created on server start.

```
POST /api/faculty  (multipart/form-data)
  → Multer: parse file buffer in memory
  → Validate: type (jpg/png/pdf), max size
  → S3 PutObjectCommand
      Bucket:  {MINIO_BUCKET_PREFIX}-{category}
      Key:     uploads/{category}/{uuid}.{ext}
  → Build public URL: STORAGE_PUBLIC_URL + key
  → Prisma: save URL to DB
  ← { fileUrl }
```

---

## 6. Data Flow Examples

### Public page — Faculty list
```
Browser → GET /departments/cse  (frontend Next.js server component)
  → fetch('http://localhost:4000/api/departments/cse')
    → Prisma: department.findUnique({ where: { slug: 'cse' }, include: { faculty, labs } })
    ← JSON { success: true, data: { ... } }
  → Next.js renders with ISR (revalidate: 60s)
← HTML sent to browser
```

### CMS — Create news article
```
Admin submits form → POST /api/news  (with Bearer token)
  → authenticate: verify JWT
  → requireRole: allow ADMIN, SUPER_ADMIN, NEWS_EDITOR
  → Zod validate body
  → Prisma: newsNotice.create({ data: { ... } })
  → AuditLog: record the action
  ← { success: true, data: { id, title, ... } }
← Success toast in admin UI
```

### Form submission — Contact
```
User submits → POST /api/contact-inquiries  (from frontend)
  → Rate limit check (strict: 5/min)
  → Zod validate body (name, email, phone, subject, message)
  → Prisma: contactInquiry.create({ data: { ... } })
  → Nodemailer: notify admin email
  ← { success: true }
← Thank you state in UI
```

---

## 7. Project Structure

```
V2/
├── docs/                    # Documentation (this folder)
├── frontend/                # Main public site (Next.js 16, port 3000)
│   ├── src/
│   │   ├── app/             # App Router — 50+ page routes
│   │   ├── components/
│   │   │   ├── layout/      # Navbar, Footer
│   │   │   ├── home/        # Homepage sections
│   │   │   └── ui/          # shadcn/ui primitives
│   │   └── lib/
│   │       ├── config.ts    # Nav links, departments, site metadata
│   │       └── api.ts       # Typed API client wrapper
│   └── package.json
├── admin/                   # CMS admin panel (Next.js 16, port 3001)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/      # Login pages
│   │   │   └── (dashboard)/ # All CRUD pages
│   │   ├── components/
│   │   │   ├── shared/      # DataTable, ConfirmDialog, FileUpload
│   │   │   ├── layout/      # Sidebar, topbar, mobile-nav
│   │   │   └── ui/          # shadcn/ui primitives
│   │   ├── hooks/
│   │   │   ├── use-auth.tsx  # AuthProvider + JWT management
│   │   │   └── use-role.ts   # Role-based access hook
│   │   └── lib/
│   │       ├── api.ts       # API client with auth headers
│   │       └── types.ts     # Shared TypeScript types
│   └── package.json
├── backend/                 # API server (Express.js 5, port 4000)
│   ├── src/
│   │   ├── index.ts         # Entry point — starts server
│   │   ├── app.ts           # Express app + middleware stack
│   │   ├── routes.ts        # Central route registry
│   │   ├── config/env.ts    # Zod-validated env vars
│   │   ├── middleware/      # auth, role, validate, upload, rate-limit, error-handler
│   │   ├── features/        # Feature modules (routes → controller → service → schema)
│   │   ├── services/        # Shared: email, storage, audit
│   │   ├── utils/           # api-response, api-error, pagination, slug, logger
│   │   └── lib/             # MinIO client setup
│   ├── prisma/
│   │   ├── schema.prisma    # DB schema (source of truth)
│   │   └── seed.ts          # Seed data
│   └── package.json
├── gpnilokheri.ac.in/       # Reference only (old site clone — DO NOT EDIT)
├── docker-compose.yml       # MinIO container only
└── PLAN.md                  # Historical planning doc (outdated — see docs/ for current state)
```

---

## 8. Environment Variables

### backend/.env
```
DATABASE_URL=postgresql://...

JWT_SECRET=                    # min 32 chars, no placeholders
JWT_REFRESH_SECRET=            # min 32 chars, no placeholders
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=              # min 8 chars, not "minioadmin"
MINIO_SECRET_KEY=              # min 8 chars, not "minioadmin"
MINIO_USE_SSL=false
MINIO_BUCKET_PREFIX=gpn
STORAGE_PUBLIC_URL=            # optional — CDN/public URL for files

FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=GBN Polytechnic <noreply@gpnilokheri.ac.in>
ADMIN_EMAIL=admin@gpnilokheri.ac.in

PORT=4000
NODE_ENV=development
```

### frontend/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### admin/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 9. Infrastructure (Docker)

Docker Compose runs **MinIO only** — PostgreSQL is external, frontend/admin/backend run directly with `bun run dev`.

```yaml
# docker-compose.yml
services:
  minio:
    image: minio/minio
    ports:
      - "9000:9000"   # API
      - "9001:9001"   # Console
```

For production, all 3 services will be containerized separately and deployed via Dokploy/VPS with Nginx reverse proxy + SSL.
