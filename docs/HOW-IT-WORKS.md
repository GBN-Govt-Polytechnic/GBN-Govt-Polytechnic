# How It Works — GBN Polytechnic V2

> A plain-English walkthrough of how the codebase works end-to-end.
> Read this if you're new to the project or want to understand the system.

---

## The Big Picture

This is a **college website** for GBN Government Polytechnic, Nilokheri. It replaces an old ASP.NET site (95 pages) with a modern TypeScript stack.

There are **3 separate apps** that talk to each other:

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│    Frontend      │     │     Admin        │     │     Backend       │
│  (Public Site)   │     │   (CMS Panel)    │     │    (REST API)     │
│  Next.js :3000   │────▶│  Next.js :3001   │────▶│  Express :4000    │
│                  │     │                  │     │       │           │
│  What visitors   │     │  What staff use   │     │       ▼           │
│  see             │     │  to manage content│     │  PostgreSQL + MinIO│
└─────────────────┘     └─────────────────┘     └──────────────────┘
```

**Frontend** = the public website anyone can visit. No login needed.
**Admin** = the content management panel where college staff log in and add/edit content.
**Backend** = the API server that both frontend and admin talk to. Stores data in PostgreSQL, files in MinIO.

---

## How a Page Gets Displayed (Frontend)

Let's trace what happens when someone visits the departments page:

### 1. User opens `gpnilokheri.ac.in/departments/cse`

### 2. Next.js server-side rendering kicks in
The file `frontend/src/app/departments/[dept]/page.tsx` handles this route.

### 3. The page calls the API
```ts
// Inside the page component (server component)
const dept = await api.departments.getBySlug("cse");
```

This uses `frontend/src/lib/api.ts` which does:
```ts
fetch("http://localhost:4000/api/departments/cse", {
  next: { revalidate: 60 }  // Cache for 60 seconds (ISR)
})
```

### 4. Backend processes the request
```
backend/src/routes.ts          → matches /departments → departmentRoutes
  → departments.routes.ts     → GET /:slug → controller.getBySlug
    → departments.controller.ts → calls service.getBySlug("cse")
      → departments.service.ts → Prisma query: department.findUnique({
          where: { slug: "cse" },
          include: { faculty: true, labs: true, hod: true }
        })
      → Returns JSON: { success: true, data: { name: "CSE", ... } }
```

### 5. Next.js renders the HTML and sends it to the browser
The page is cached for 60 seconds (ISR). Next visitor within 60s gets the cached version.

---

## How Content Gets Created (Admin)

Let's trace adding a news article:

### 1. Staff member opens `admin.gpnilokheri.ac.in` and logs in
- Login form → POST `/api/auth/login` with email + password
- Backend verifies password with bcrypt, creates JWT tokens
- Admin app stores tokens in localStorage
- `use-auth.tsx` hook manages the auth state

### 2. Staff navigates to News page and clicks "Create"
- The admin sidebar (role-based) shows only what they have access to
- News page loads existing articles from GET `/api/news`
- Click "Create" opens a form

### 3. Staff fills in the form and submits
```
Title: "Annual Sports Day 2026"
Category: NEWS
Content: "..."
Attachment: sports-day.pdf
Status: PUBLISHED
```

### 4. Admin app sends the request
```ts
// admin/src/lib/api.ts
POST /api/news
Headers: { Authorization: "Bearer <accessToken>" }
Body: FormData (because of file upload)
```

### 5. Backend processes it
```
routes.ts → /news → news.routes.ts
  → authenticate middleware: verifies JWT, attaches req.user
  → requireRole(ADMIN, NEWS_EDITOR): checks if user's role is allowed
  → upload middleware (Multer): parses the PDF from multipart form
  → validate middleware: Zod validates the body fields
  → news.controller.ts → news.service.ts:
    1. Upload PDF to MinIO bucket
    2. Create record in PostgreSQL via Prisma
    3. Log action to audit table
    4. Return the created news item
```

### 6. Frontend automatically shows it
Next time someone visits `/news`, the ISR cache refreshes (within 60s) and the new article appears.

---

## The Backend Pattern

Every feature follows the same 4-file pattern:

```
features/news/
├── news.routes.ts       ← Defines URL paths + middleware chain
├── news.controller.ts   ← Handles HTTP request/response
├── news.service.ts      ← Business logic + database calls
└── news.schema.ts       ← Zod validation schemas
```

**Flow:** Route → Middleware → Controller → Service → Database

### Routes (`*.routes.ts`)
Wires URLs to controllers with middleware:
```ts
router.get("/", controller.list);                           // Public
router.post("/", authenticate, requireRole(ADMIN), validate(createSchema), controller.create);  // Protected
```

### Controllers (`*.controller.ts`)
Thin layer — just calls the service and formats the response:
```ts
const create = async (req, res) => {
  const data = await newsService.create(req.body, req.user.id);
  ApiResponse.created(res, data);
};
```

### Services (`*.service.ts`)
Where the real logic lives — Prisma queries, file uploads, business rules:
```ts
const create = async (data, userId) => {
  const news = await prisma.newsNotice.create({ data: { ...data, createdById: userId } });
  await auditService.log("NEWS_CREATED", userId, { newsId: news.id });
  return news;
};
```

### Schemas (`*.schema.ts`)
Zod schemas for input validation:
```ts
const createNewsSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10),
  category: z.nativeEnum(NewsCategory),
  status: z.nativeEnum(ContentStatus).default("DRAFT"),
});
```

---

## Authentication & Authorization

### Who can log in?
Only **admin users** (college staff). No student or alumni accounts. The `AdminUser` table stores:
- Email + hashed password (bcrypt)
- Role: SUPER_ADMIN, ADMIN, HOD, TPO, MEDIA_MANAGER, or NEWS_EDITOR
- Optional department link (for HODs)

### How tokens work
```
Login → Backend creates 2 tokens:
  accessToken  (15 min lifespan) — used for API calls
  refreshToken (7 day lifespan)  — used to get new accessTokens

When accessToken expires:
  Admin app automatically calls POST /api/auth/refresh
  Gets a fresh accessToken
  User doesn't notice anything
```

### Role hierarchy
```
SUPER_ADMIN  — Can do everything, manage users
  ADMIN      — Can manage all content
    HOD      — Can manage own department's content only
    TPO      — Can manage placement content only
    MEDIA_MANAGER — Can manage gallery, hero slides, events
    NEWS_EDITOR   — Can manage news/notices only
```

HODs are **scoped to their department** — the `departmentScope` middleware ensures an HOD of CSE can't edit ECE's faculty.

---

## File Storage (MinIO)

Files (images, PDFs) are stored in **MinIO**, an S3-compatible object storage running in Docker.

### Upload flow
```
User uploads file → Multer parses it in memory (no temp files)
  → File type validated (only jpg/png/pdf/etc.)
  → File uploaded to MinIO via S3 API
  → Public URL stored in database
  → URL returned to client
```

### Bucket structure
```
gpn-uploads/
├── faculty/       ← Faculty photos
├── news/          ← News attachments
├── gallery/       ← Gallery images
├── study-materials/ ← PDFs
├── lesson-plans/
├── syllabus/
├── hero-slides/
└── ...
```

---

## The Database

PostgreSQL via Prisma ORM. Schema defined in `backend/prisma/schema.prisma`.

### Key models and their relationships
```
AdminUser ──┐
            │ creates/manages
            ▼
Department ←──── Faculty (belongs to department)
    │              └── Study materials, lesson plans, syllabus, timetables
    │
    ├── Lab (belongs to department)
    ├── Course (belongs to department)
    └── ... (scoped content)

NewsNotice ──── Categories: NEWS, NOTICE, CIRCULAR, TENDER, EVENT
                Status: DRAFT → PUBLISHED → ARCHIVED

GalleryAlbum ──── GalleryImage (one-to-many)

PlacementCompany ─┐
PlacementStat     ├── Placement module
PlacementActivity ─┘

ContactInquiry ─── From contact form
Complaint      ─── From complaint form

AuditLog ─── Every admin action logged (who did what, when)
SiteSetting ─── Key-value config (site name, contact info, etc.)
AcademicSession ─── Academic year tracking
```

### Content lifecycle
Most content follows: `DRAFT → PUBLISHED → ARCHIVED`
- Staff creates content as DRAFT
- Publishes when ready (shows on frontend)
- Archives when outdated (hidden from frontend, not deleted)

---

## The Frontend (How pages are organized)

### Static pages
Hardcoded content in JSX. No API calls. Things like "About Us", "Rules", "Committees".
These are in `frontend/src/app/about/`, `frontend/src/app/committees/`, etc.

### Dynamic pages
Fetch data from the backend API. Things like departments, news, gallery.
Use Next.js **ISR** (Incremental Static Regeneration) — cached for 60 seconds.

### The config file (`frontend/src/lib/config.ts`)
This is the **brain of the frontend**. It defines:
- Navigation links (what shows in the navbar)
- Department list (8 departments with slugs, names, descriptions)
- Site metadata (name, description, contact info)
- Quick links for the homepage
- Stats counters

If you need to change the site structure, start here.

### The API client (`frontend/src/lib/api.ts`)
Every API call goes through this typed wrapper:
```ts
api.departments.list()           // GET /api/departments
api.departments.getBySlug("cse") // GET /api/departments/cse
api.news.list({ page: 1 })      // GET /api/news?page=1
api.news.getBySlug("some-news")  // GET /api/news/some-news
api.gallery.list()               // GET /api/gallery
api.heroSlides.list()            // GET /api/hero-slides
api.contact.submit(data)         // POST /api/contact-inquiries
```

---

## The Admin Panel (How CRUD pages work)

All admin pages follow the same pattern:

### Data Table pattern
```
1. Page loads → fetches data from API (with auth token)
2. Displays data in a DataTable component (sortable, searchable)
3. "Create" button → opens form dialog
4. "Edit" button → opens form dialog pre-filled
5. "Delete" button → opens confirmation dialog
6. On submit → POST/PUT/DELETE to API → refresh table
```

### Shared components
- `DataTable` — reusable table with sorting, filtering, pagination
- `ConfirmDialog` — "Are you sure?" modal for deletes
- `FileUpload` — drag-and-drop file upload to MinIO
- `Sidebar` — role-based navigation (shows only what user can access)

### Auth flow in admin
```
use-auth.tsx (AuthProvider) wraps the entire app:
  → On mount: check localStorage for tokens
  → If token exists: call GET /api/auth/me to get user
  → If valid: show dashboard
  → If expired: try refresh token
  → If no token/refresh fails: redirect to /login
```

---

## Running the Project Locally

### Prerequisites
- Node.js 18+ (or just use Bun)
- Bun (package manager + runtime)
- Docker (for MinIO)
- PostgreSQL (external, not in Docker)

### Start everything
```bash
# 1. Start MinIO (file storage)
docker compose up -d

# 2. Start backend
cd backend
bun install
cp .env.example .env        # Fill in your values
bunx prisma migrate dev     # Create database tables
bunx prisma db seed         # Seed initial data
bun run dev                 # → http://localhost:4000

# 3. Start frontend
cd frontend
bun install
bun run dev                 # → http://localhost:3000

# 4. Start admin
cd admin
bun install
bun run dev                 # → http://localhost:3001
```

### Useful commands
```bash
bunx prisma studio          # Visual database browser
bunx prisma migrate dev     # Run pending migrations
bunx prisma db seed         # Re-seed the database
```

---

## Quick Reference: Where to Find Things

| Want to... | Go to... |
|---|---|
| Add a new page (public) | `frontend/src/app/<route>/page.tsx` |
| Add a new API endpoint | `backend/src/features/<feature>/` (4 files) + register in `routes.ts` |
| Add a new admin CRUD page | `admin/src/app/(dashboard)/<feature>/page.tsx` |
| Change navigation links | `frontend/src/lib/config.ts` |
| Change database schema | `backend/prisma/schema.prisma` → run `bunx prisma migrate dev` |
| Add a new department | `frontend/src/lib/config.ts` (DEPARTMENTS array) + seed in DB |
| Change auth roles | `backend/prisma/schema.prisma` (AdminRole enum) |
| Change rate limits | `backend/src/middleware/rate-limit.ts` |
| Add file upload to a feature | Use `upload` middleware in routes + `storageService` in service |
| View/manage environment config | `backend/src/config/env.ts` (Zod schema defines all vars) |
