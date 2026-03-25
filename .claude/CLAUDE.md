# GBN Polytechnic V2 — College Website Rebuild

> A full-stack rebuild of gpnilokheri.ac.in: 95 old ASP.NET pages → 25 modern routes across three services.

## Architecture (3 services)

| Service    | Stack                              | Port | Dir         |
|------------|------------------------------------|------|-------------|
| **Frontend** | Next.js 16, Tailwind 4, shadcn/ui | 3000 | `frontend/` |
| **Admin**    | Next.js 16, Tailwind 4, shadcn/ui | 3001 | `admin/`    |
| **Backend**  | Express 5, Prisma, PostgreSQL      | 4000 | `backend/`  |

**Package manager:** Bun (all three services)
**File storage:** MinIO S3-compatible (via Docker)
**Language:** TypeScript everywhere

## Quick Commands

```bash
# Backend
cd backend && bun install && bun run dev      # Express on :4000
cd backend && bunx prisma migrate dev          # Run migrations
cd backend && bunx prisma db seed              # Seed database
cd backend && bunx prisma studio               # DB GUI

# Frontend
cd frontend && bun install && bun run dev      # Next.js on :3000

# Admin
cd admin && bun install && bun run dev         # Next.js on :3001

# Infrastructure
docker compose up -d                           # MinIO on :9000 (console :9001)
```

## Backend Structure (`backend/src/`)

Feature-based organization following Controller → Service → Schema pattern:

```
src/
├── app.ts              # Express app setup (middleware stack)
├── routes.ts           # Central route registry — ALL routes here
├── config/env.ts       # Zod-validated env vars (source of truth for config)
├── middleware/          # auth, role, validate, upload, rate-limit, error-handler
├── features/           # Feature modules (each has routes, controller, service, schema)
│   ├── auth/           # JWT login, register, refresh, password reset
│   ├── departments/    # 7 departments (CSE, ECE, EE, CE, ME, ICE, AS)
│   ├── faculty/
│   ├── content/        # news, events, gallery, hero-slides
│   ├── academics/      # courses, labs, resources (study-materials, lesson-plans, syllabus, timetables)
│   ├── placements/     # companies, stats, activities
│   ├── submissions/    # contact inquiries, complaints
│   ├── users/          # admin user CRUD (Super Admin only)
│   ├── results/
│   ├── admin/          # settings, audit-log
│   ├── achievements/
│   ├── mous/
│   ├── notifications/
│   ├── dashboard/
│   └── sessions/       # academic sessions
├── services/           # Shared services (email, s3, audit)
├── utils/              # api-response, api-error, pagination, slug
└── prisma/schema.prisma  # DATABASE SCHEMA (source of truth)
```

**Key patterns:**
- Every feature module: `*.routes.ts` → `*.controller.ts` → `*.service.ts` → `*.schema.ts`
- Validation: Zod schemas in `*.schema.ts`, applied via `validate` middleware
- Auth: JWT two-token system (15min access + 7d refresh)
- RBAC roles: `SUPER_ADMIN > ADMIN > HOD > TPO > MEDIA_MANAGER > NEWS_EDITOR`
- Responses: Always use `ApiResponse.success()`, `.created()`, `.paginated()`, `.noContent()`
- Errors: Throw `new ApiError(status, message)` — caught by global error handler
- Rate limiting: 3 tiers — global (100/min), strict (5/min), auth (10/min)

## Frontend Structure (`frontend/src/`)

```
src/
├── app/                # Next.js App Router — 25+ page routes
├── components/
│   ├── layout/         # Navbar, Footer
│   ├── home/           # Homepage sections (hero-slider, departments-preview, etc.)
│   └── ui/             # shadcn/ui primitives
└── lib/
    ├── config.ts       # Nav links, department definitions, site metadata — START HERE
    └── api.ts          # Typed API client wrapper
```

**Key patterns:**
- Static/SSG pages where possible, ISR (60s) for semi-dynamic content
- All site structure (nav, departments, stats) defined in `config.ts`
- API calls go through `lib/api.ts` typed wrapper
- UI built with shadcn/ui components + Tailwind utility classes

## Admin Structure (`admin/src/`)

```
src/
├── app/
│   ├── (auth)/         # Login pages
│   └── (dashboard)/    # All CRUD pages (courses, events, news, faculty, gallery, etc.)
├── components/
│   ├── shared/         # DataTable, ConfirmDialog, FileUpload — reuse these
│   ├── layout/         # Sidebar, topbar, mobile-nav
│   └── ui/             # shadcn/ui primitives
├── hooks/
│   ├── use-auth.tsx    # AuthProvider + JWT management
│   └── use-role.ts     # Role-based access hook
└── lib/
    ├── api.ts          # API client with auth headers
    └── types.ts        # Shared TypeScript types
```

## Database (Prisma)

Schema at `backend/prisma/schema.prisma`. Key models:

- **AdminUser** (roles: SUPER_ADMIN, ADMIN, HOD, TPO, MEDIA_MANAGER, NEWS_EDITOR)
- **Department** (7 depts), **Faculty**, **Lab**, **Course**
- **NewsNotice** (categories: NEWS, NOTICE, CIRCULAR, TENDER), **Event**, **GalleryAlbum/Image**
- **PlacementCompany/Stat/Activity**, **Achievement**, **MoU**
- **ContactInquiry**, **Complaint** (submission forms), **Student** (model exists but unused — no routes)
- **AuditLog**, **SiteSetting**, **AcademicSession**
- Content lifecycle: `DRAFT → PUBLISHED → ARCHIVED` (ContentStatus enum)

## Documentation

- `PLAN.md` — Project strategy, page mapping, timeline
- `docs/ARCHITECTURE.md` — Technical architecture and patterns
- `docs/FEATURES.md` — Feature checklist with P0/P1/P2 priorities (~83 features)
- `docs/SITEMAP.md` — Route mapping (old 95 pages → new 25 routes)
- `docs/TODO.md` — Development task checklist
- `gpnilokheri.ac.in/` — Old site HTML files (REFERENCE ONLY — never edit)

## Code Style & Conventions

See `.claude/rules/` for detailed rules per area. Summary:

- **Backend:** JSDoc with `@org GBN Government Polytechnic, Nilokheri`, `@license All rights reserved — GBN Government Polytechnic, Nilokheri` on every file; function-level docs
- **Frontend/Admin:** JSDoc file headers (org + license); shadcn/ui components from `components/ui/`
- **Commits:** Conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`)
- **No `any` types** — use proper TypeScript types
- **Bun** for all package management and script running

## The SABERS Framework

**Any model running this project (Opus, Sonnet, Haiku, or any future model) MUST follow SABERS.** The orchestrating model spawns subagents and applies their outputs. See `.claude/agents/` for all agents.

**Self-improving:** Agents read `.claude/lessons/` before each task and write new lessons after. The system gets smarter over time.

### When to use FULL vs LITE

| Mode | When | What runs |
|------|------|-----------|
| **FULL** | New features, multi-file changes, anything touching auth/security/database | All 6 phases, all agents |
| **LITE** | Simple questions, single-file fixes, typos, docs-only changes, explanations | Scout (query only) → Execute → done |

Decide mode in Scout phase. Default to FULL when unsure.

### S — Scout (Explore) — 3 agents

1. **scout-query** (Haiku) — Parses the user's request. Classifies task type, scope, and whether FULL or LITE mode.
2. **scout-researcher** (Sonnet) — Searches codebase for all relevant files. Maps what needs reading.
3. **scout-reader** (Haiku) — Reads found files, extracts key context so Opus doesn't re-read everything.

Run scout-query first → then scout-researcher + scout-reader in parallel.

### A — Align (Ask the User)

Present Scout findings to the user. Confirm approach before coding.
- State what you understood (from scout-query)
- Show what files are involved (from scout-researcher)
- Propose what to change and why
- Never skip — even for "obvious" fixes

### B — Blueprint (Plan) — 1 agent (lessons-aware)

**blueprint-architect** (Sonnet) — Reads `.claude/lessons/` FIRST, then creates step-by-step implementation plan. Proactively prevents known pitfalls from past tasks.

### E — Execute (Implement)

The orchestrating model writes the code directly, following the Blueprint.
- Match existing patterns from `.claude/rules/`
- Keep changes minimal and focused

### R — Review (Security + Quality) — 2 agents in parallel (lessons-aware)

1. **security-sentinel** (Sonnet) — OWASP Top 10 audit + rate-limit coverage audit + input validation completeness + file upload security checklist. Reads `.claude/lessons/security.md` first to catch recurring patterns. Outputs exact fix code.
2. **quality-gate** (Sonnet) — Code quality, TypeScript types, pattern adherence, JSDoc, performance, naming, dead code, data integrity. Reads `.claude/lessons/quality.md` first. Outputs exact fix code.

Both run in parallel. Fix all CRITICAL/MUST_FIX issues before proceeding.

### S — Sync (Self-Revise + Learn + Report) — 3 agents

1. **context-keeper** (Sonnet) — Verifies CLAUDE.md, docs, agent definitions, AND rules match reality. Outputs exact edit instructions.
2. **sync-reporter** (Haiku) — Generates exact edit instructions for docs (FEATURES.md, TODO.md, SITEMAP.md, CLAUDE.md) + task report.
3. **retro-learner** (Haiku) — Analyzes Review findings, outputs new lessons to add to `.claude/lessons/`.

**CRITICAL — The orchestrating model (whatever model is running) MUST do these after the 3 agents finish. This is non-negotiable regardless of which model you are:**

1. **Apply ALL doc edits** from context-keeper and sync-reporter using the Edit tool. Every "Edit:" instruction they output MUST be applied to the actual files. Do not skip any.
2. **Apply ALL lesson updates** from retro-learner. Append new lessons to `.claude/lessons/security.md`, `quality.md`, or `patterns.md` as instructed. Update catch counts on existing lessons.
3. **Verify** by reading the edited files to confirm changes were applied correctly.
4. **Present the task report** from sync-reporter to the user.

Agents output the instructions. The orchestrating model applies them. No edit instruction should be left unapplied.

## Learning System (`.claude/lessons/`)

The system improves over time via a lessons directory:

| File | Contents | Written by | Read by |
|------|----------|-----------|---------|
| `security.md` | Security patterns caught in reviews | retro-learner | security-sentinel, blueprint-architect |
| `quality.md` | Quality patterns caught in reviews | retro-learner | quality-gate, blueprint-architect |
| `patterns.md` | Architecture decisions (worked/failed) | retro-learner | blueprint-architect |

**Flow:** Review agents catch issues → retro-learner records them → next task's Blueprint + Review agents read them → fewer issues over time.

Lessons include: what happened, where it appears, how to fix it, and how many times it's been caught. Frequently recurring patterns signal the need for a structural fix (new middleware, shared utility, etc.), not just a lesson.

## Agent Team Summary

| Agent | Model | Phase | Job |
|-------|-------|-------|-----|
| scout-query | Haiku | Scout | Parse user request, classify task |
| scout-researcher | Sonnet | Scout | Find all relevant files |
| scout-reader | Haiku | Scout | Read files, build context summary |
| blueprint-architect | Sonnet | Blueprint | Lessons-aware implementation planning |
| security-sentinel | Sonnet | Review | OWASP + rate limits + input validation + lessons check |
| quality-gate | Sonnet | Review | Code quality + patterns + lessons check |
| context-keeper | Sonnet | Sync | Verify docs + agents + rules match codebase |
| sync-reporter | Haiku | Sync | Update docs + generate task report |
| retro-learner | Haiku | Sync | Capture lessons for future improvement |

**Subagent model assignments:** Haiku for fast/simple tasks (parsing, reading, reporting, lessons). Sonnet for reasoning-heavy tasks (searching, planning, security, quality). The orchestrating model (whichever you are) spawns these subagents and writes the code.

## Pre-Commit Checklist

When the user asks to commit, BEFORE committing:
1. Ensure Review phase (R) was completed — no unresolved security/quality issues
2. Ensure Sync phase (S) was completed — docs are up to date, lessons captured
3. Use conventional commit format (`feat:`, `fix:`, `docs:`, `refactor:`)
