# TODO

> Actionable tasks only. No theory. Checked = done.

---

## Bugs (fix first)

- [x] **Complaint admin type mismatch** — fixed admin types + submissions page to use `subject`/`message` matching Prisma model
- [x] **Faculty `experience` field missing from DB** — added `experience String?` to Prisma schema + Zod create/update schemas
- [x] **PlacementCompany `industry` field missing from DB** — added `industry String?` to Prisma schema + Zod create/update schemas
- [x] **OpenGraph metadata missing** — added `openGraph` + `twitter` card metadata to root layout
- [x] **MinIO images `remotePatterns`** — added LAN, production CDN domain patterns to next.config.ts

---

## Admin pages to build (backend API exists, no UI)

- [ ] `/mous` — CRUD MoU records with document upload
- [ ] `/notifications` — create/list/delete notifications
- [ ] `/settings` — site settings editor (principal info, contact, social links)
- [ ] `/backup` — make functional (build backend API routes for BackupRecord + wire admin UI)

---

## Frontend pages to connect to API (exist but use static/placeholder data)

- [ ] `/about/mou` — currently 26 hardcoded companies, connect to `GET /api/mous`
- [ ] `/placement` — has API with static fallback, remove fallback and use API properly
- [ ] `/about/achievements` — has API with static fallback, remove fallback and use API properly

---

## SEO & infrastructure

- [x] Add `app/robots.ts` — block `/developer`, `/site-map`, `/_next`
- [ ] Add JSON-LD structured data (`EducationalOrganization`) to homepage
- [ ] Add root `error.tsx` to frontend (catch unhandled server errors)
- [ ] Add root `loading.tsx` to frontend (skeleton during navigation)
- [ ] Add `typecheck` script (`tsc --noEmit`) to all 3 `package.json` files
- [ ] Add `lint` script to backend `package.json`
- [ ] Lighthouse audit — target 90+ on all metrics
- [ ] Accessibility audit (aria labels, keyboard nav, contrast ratios)
- [ ] Mobile test (iOS Safari, Android Chrome)

---

## Database / backend cleanup

- [ ] Remove or repurpose `Student` model in Prisma schema — completely unused, no routes, no auth
- [ ] Implement actual email dispatch in `notifications.service.ts` (has a TODO comment)
- [ ] Add `BackupRecord` backend routes (admin page stub exists but no API)
- [ ] Add delete endpoints to: placement companies, placement stats, placement activities, users (if missing)

---

## Cleanup

- [ ] Delete orphaned frontend pages: `/login`, `/register`, `/forgot-password` (no student auth)
