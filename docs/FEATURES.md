# Features — GBN Polytechnic V2

> Priority-based feature checklist with current implementation status.
> **P0** = Must-have (launch blocker) · **P1** = Should-have · **P2** = Nice-to-have (post-launch)
> **Status:** Done = implemented · Partial = backend done but no frontend/admin UI · Not started = neither

---

## 1. Authentication & Authorization

| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 1.1 | Email/password login (admin) | P0 | Done | Custom JWT via bcryptjs + jsonwebtoken |
| 1.2 | Password reset (email token) | P0 | Done | Nodemailer → SMTP |
| 1.3 | Role-based access control (RBAC) | P0 | Done | Super Admin, Admin, HOD, TPO, Media Manager, News Editor |
| 1.4 | Protected API routes | P0 | Done | authenticate + requireRole middleware on all mutation endpoints |
| 1.5 | JWT + refresh token flow | P0 | Done | 15min access token, 7d refresh stored in DB |
| 1.6 | Login page (admin) | P0 | Done | Admin CMS login with auto-refresh |

> **Removed from scope:** Student auth, alumni auth, frontend login — frontend is public-only. Orphan login/register pages in frontend need cleanup.

---

## 2. Public Website — Static Pages

| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 2.1 | Homepage (hero slider, stats, quick links, departments, placements) | P0 | Done | |
| 2.2 | About — Institute history, vision, mission, quality policy | P0 | Done | |
| 2.3 | About — Principal's message | P0 | Done | Hardcoded — static is fine |
| 2.4 | About — Infrastructure | P0 | Done | |
| 2.5 | About — Location / Map | P0 | Done | Google Maps embed |
| 2.6 | About — Mandatory Disclosure | P0 | Done | PDF download |
| 2.7 | About — IQAC | P1 | Done | |
| 2.8 | About — Green Campus | P1 | Done | |
| 2.9 | About — Innovation Club / IIC | P1 | Done | |
| 2.10 | About — NEP Implementation | P1 | Done | |
| 2.11 | About — MoU list | P1 | Done | Fetches from API with static fallback |
| 2.12 | Committees — Anti-ragging, ICC, Grievance, Discipline, SC/ST | P0 | Done | 5 separate pages |
| 2.13 | Rules — Code of conduct | P0 | Done | Combined rules page |
| 2.14 | Contact — Helpline numbers | P0 | Done | |
| 2.15 | Academics — Overview | P0 | Done | |
| 2.16 | Academics — Courses offered | P0 | Done | 8 departments |
| 2.17 | Academics — Scholarships | P0 | Done | |
| 2.18 | Academics — Results | P0 | Done | HSBTE portal link — static is fine |
| 2.19 | Academics — E-learning resources | P1 | Done | External links |
| 2.20 | Contact Us | P0 | Done | Form + static info |
| 2.21 | Admissions | P0 | Done | Admission process + contacts |
| 2.22 | Placement — Apprenticeship | P0 | Done | NAPS info |
| 2.23 | Services — Faculty e-services | P1 | Done | External portal links |
| 2.24 | Services — Student e-services | P1 | Done | External portal links |
| 2.25 | NCC activities | P2 | Done | |
| 2.26 | Feedback portal link | P1 | Done | AICTE link |
| 2.27 | MHRD projects | P1 | Done | |
| 2.28 | Developer credits page | — | Done | |
| 2.29 | HTML site map | — | Done | |

**29 of 29 static pages complete.**

---

## 3. Public Website — Dynamic Pages (Data from API)

| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 3.1 | Department index page | P0 | Done | Lists all departments from config |
| 3.2 | Department detail (about, HOD, vision, faculty, labs, courses, resources) | P0 | Done | Dynamic `[dept]` route, fetches 6 datasets |
| 3.3 | Faculty list per department | P0 | Done | Via department detail page |
| 3.4 | News & events feed | P0 | Done | `/news` with category sections |
| 3.5 | News detail page | P0 | Done | `/news/[slug]` |
| 3.6 | Gallery — photo albums | P0 | Done | `/gallery` + `/gallery/[id]` |
| 3.7 | Exam results | P0 | Done | HSBTE portal link |
| 3.8 | Achievements page | P0 | Partial | Has API call but falls back to static — needs proper wiring |
| 3.9 | Placement stats overview | P0 | Partial | Has API call but falls back to static — needs proper wiring |

> **Removed from scope:** Syllabus downloads, timetable downloads, documents page, placement companies/activities/visits, campus events, admission status, study materials/lesson plans standalone pages, lab details standalone page.

---

## 4. Forms (Public Submissions)

| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 4.1 | Contact Us form | P0 | Done | Name, email, phone, subject, message |
| 4.2 | Complaint / Grievance form | P0 | Done | Backend ready |
| 4.3 | Form spam protection | P0 | Done | Rate limiting (strict: 5/min) |
| 4.4 | Form submission email notifications | P0 | Done | Nodemailer → admin email |

> **Removed from scope:** Industry collaboration form, placement contact form, alumni registration form.

---

## 5. CMS — Content Management (Admin Panel)

### 5.1 Foundation
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 5.1.1 | Admin dashboard overview | P0 | Done | Quick stats from API |
| 5.1.2 | Auth guard + role-based sidebar | P0 | Done | `use-auth.tsx` + `use-role.ts` |
| 5.1.3 | Shared DataTable component | P0 | Done | Reusable across all CRUD pages |
| 5.1.4 | File upload component | P0 | Done | Shared FileUpload for S3 |

### 5.2 Department Management
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 5.2.1 | CRUD departments | P0 | Done | |
| 5.2.2 | CRUD faculty per department | P0 | Done | Photo upload to MinIO |
| 5.2.3 | CRUD study materials | P0 | Done | PDF upload, dept/sem filter |
| 5.2.4 | CRUD lesson plans | P0 | Done | PDF upload |
| 5.2.5 | CRUD syllabus | P0 | Done | PDF upload |
| 5.2.6 | CRUD lab details | P1 | Done | |
| 5.2.7 | CRUD courses | P0 | Done | |

### 5.3 News & Content
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 5.3.1 | CRUD news/notices | P0 | Done | Categories: NEWS, NOTICE, CIRCULAR, TENDER, EVENT |
| 5.3.2 | CRUD events | P1 | Done | |
| 5.3.3 | CRUD achievements | P0 | Done | |
| 5.3.4 | Manage hero slider | P0 | Done | Image upload to MinIO |

### 5.4 Placement & Training
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 5.4.1 | CRUD placement records | P0 | Done | `/placement/records` |
| 5.4.2 | CRUD recruiting companies | P0 | Done | `/placement/companies` |
| 5.4.3 | CRUD placement activities | P1 | Done | `/placement/activities` |

### 5.5 Media & Submissions
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 5.5.1 | Gallery album management | P0 | Done | Create albums, batch upload |
| 5.5.2 | View form submissions | P0 | Done | `/submissions` page |
| 5.5.3 | Audit log viewer | P0 | Done | `/logs` page |

### 5.6 User Management
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 5.6.1 | User CRUD (Super Admin only) | P0 | Done | |
| 5.6.2 | Role assignment | P0 | Done | |

### 5.7 Admin Pages To Build (Backend API exists, no UI)
| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 5.7.1 | MoU management | P1 | Done | Full CRUD with document upload |
| 5.7.2 | Notifications management | P1 | Done | List + create + delete (email dispatch is stubbed) |
| 5.7.3 | Site settings editor | P0 | Done | Key-value editor for all site settings + social links |
| 5.7.4 | Backup management | P1 | Not started | Admin stub page exists, **no backend API** — needs both |

> **Removed from scope:** Timetable admin UI, results admin UI, academic sessions admin UI.

---

## 6. Technical / Non-Functional Features

| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| 6.1 | Responsive design (mobile-first) | P0 | Done | All pages |
| 6.2 | SEO optimization | P0 | Partial | Meta tags on pages, sitemap.xml exists, needs structured data |
| 6.3 | Performance (Core Web Vitals) | P0 | Partial | Next.js Image used, needs Lighthouse audit |
| 6.4 | Rate limiting on API | P0 | Done | 3 tiers: global, strict, auth |
| 6.5 | Health check endpoint | P0 | Done | GET /api/health |
| 6.6 | Accessibility (WCAG 2.1 AA) | P1 | Partial | Basic aria labels, needs full audit |
| 6.7 | Error monitoring | P1 | Not started | |
| 6.8 | PWA support | P2 | Not started | |

---

## Feature Count Summary

| Category | Total | Done | Partial | Not Started |
|----------|-------|------|---------|-------------|
| Auth & Authorization | 6 | 6 | 0 | 0 |
| Static Pages | 29 | 29 | 0 | 0 |
| Dynamic Pages | 9 | 7 | 2 | 0 |
| Forms | 4 | 4 | 0 | 0 |
| CMS Admin | 24 | 23 | 0 | 1 |
| Technical | 8 | 3 | 3 | 2 |
| **Total** | **80** | **72** | **5** | **3** |

> **~90% complete.** All auth, forms, static pages, and core CMS done. Remaining: 2 frontend pages need full API data (achievements, placements have static fallbacks), 1 admin UI (backup), and SEO/infra polish.
