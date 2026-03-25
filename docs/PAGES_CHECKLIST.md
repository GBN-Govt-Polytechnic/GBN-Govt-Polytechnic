# Pages Checklist — Frontend (Main Site)

> Tracks every page in the public-facing Next.js frontend.
> `[x]` = Done · `[ ]` = Not done · `[—]` = Removed from scope
> **S** = Static · **D** = Dynamic (needs API) · **F** = Form · **M** = Media/Download

---

## 1. Home & General

| # | Route | Type | Status |
|---|-------|------|--------|
| 1 | `/` | D | [x] Homepage (hero, stats, quick links, departments, placements) |
| 2 | `/about` | S | [x] History, vision, mission, milestones, quality policy |
| 3 | `/about/principal` | S | [x] Principal's desk — message + photo |
| 4 | `/about/infrastructure` | S | [x] Labs, hostels, library, sports, green campus |
| 5 | `/about/achievements` | D | [x] Awards & achievements (placeholder — will be dynamic) |
| 6 | `/about/green-campus` | S | [x] Green campus initiatives |
| 7 | `/about/mandatory-disclosure` | M | [x] PDF download page |
| 8 | `/about/iqac` | S | [x] IQAC committee members |
| 9 | `/about/location` | S | [x] Google Maps embed |
| 10 | `/about/mou` | S | [x] MOU list with industries |
| 11 | `/about/nep` | S | [x] NEP 2020 info |

## 2. Academics

| # | Route | Type | Status |
|---|-------|------|--------|
| 12 | `/academics` | S | [x] Academic overview |
| 13 | `/academics/courses` | S | [x] Courses offered table (8 departments) |
| 14 | `/academics/scholarships` | S | [x] Scholarship schemes |
| 15 | `/academics/results` | D | [x] Exam results (placeholder — will be dynamic) |
| 16 | `/academics/resources` | S | [x] Online learning portal links |
| 17 | `/academics/syllabus` | D | [ ] Syllabus downloads per dept/sem |
| 18 | `/academics/timetable` | D | [ ] Timetable downloads per dept/sem |

## 3. Departments

| # | Route | Type | Status |
|---|-------|------|--------|
| 19 | `/departments` | S | [x] Department index page |
| 20 | `/departments/[dept]` | D | [x] Department detail (about, faculty, labs) |

## 4. Placement & Training

| # | Route | Type | Status |
|---|-------|------|--------|
| 21 | `/placement` | D | [x] Placement overview (placeholder — will be dynamic) |
| 22 | `/placement/apprenticeship` | S | [x] NAPS scheme info |
| 23 | `/placement/companies` | D | [ ] Recruiting companies list |
| 24 | `/placement/activities` | D | [ ] TPO reports |
| 25 | `/placement/visits` | D | [ ] Industrial visits |
| 26 | `/placement/contact` | F | [ ] Student placement form |

## 5. Campus Life

| # | Route | Type | Status |
|---|-------|------|--------|
| 27 | `/gallery` | D | [x] Gallery albums page |
| 28 | `/gallery/[id]` | D | [x] Individual album detail |
| 29 | `/campus/ncc` | S | [x] NCC activities |
| 30 | `/campus/innovation` | S | [x] Innovation Club + IIC |
| 31 | `/campus/events` | D | [ ] Cultural & extracurricular events |

## 6. News

| # | Route | Type | Status |
|---|-------|------|--------|
| 32 | `/news` | D | [x] News/notice listing |
| 33 | `/news/[slug]` | D | [x] News detail page |

## 7. Committees & Cells

| # | Route | Type | Status |
|---|-------|------|--------|
| 34 | `/committees/anti-ragging` | S | [x] Anti-ragging committee + rules |
| 35 | `/committees/icc` | S | [x] Internal Complaint Committee |
| 36 | `/committees/grievance` | S | [x] Grievance Redressal Committee |
| 37 | `/committees/discipline` | S | [x] Discipline Committee |
| 38 | `/committees/sc-st` | S | [x] SC/ST Committee |

## 8. Admissions

| # | Route | Type | Status |
|---|-------|------|--------|
| 39 | `/admissions` | S | [x] Admission process + contacts |
| 40 | `/admissions/status` | D | [ ] Admission status per department |

## 9. Contact & Support

| # | Route | Type | Status |
|---|-------|------|--------|
| 41 | `/contact` | F | [x] Contact form + info |
| 42 | `/contact/industry` | F | [ ] Industry collaboration form |
| 43 | `/contact/helpline` | S | [x] Helpline numbers |

## 10. Rules & Policies

| # | Route | Type | Status |
|---|-------|------|--------|
| 44 | `/rules` | S | [x] Rules & anti-ragging (combined) |
| 45 | `/rules/code-of-conduct` | M | [x] Student conduct PDF download |

## 11. Resources & Services

| # | Route | Type | Status |
|---|-------|------|--------|
| 46 | `/services/faculty` | S | [x] Faculty e-services (training portals) |
| 47 | `/services/students` | S | [x] Student e-services (scholarships, etc.) |
| 48 | `/documents` | M | [ ] Downloadable official documents |
| 49 | `/feedback` | S | [x] AICTE feedback portal link |
| 50 | `/mhrd` | S | [x] MHRD projects info |

## 12. Misc (Not in original plan)

| # | Route | Type | Status |
|---|-------|------|--------|
| 51 | `/developer` | S | [x] Developer credits page |
| 52 | `/site-map` | S | [x] HTML sitemap page |

## 13. Removed from Scope

| # | Route | Reason |
|---|-------|--------|
| — | `/alumni/register` | [—] Alumni feature removed (2026-03-15) |
| — | `/alumni/directory` | [—] Alumni feature removed |
| — | `/login` | [—] No student/alumni auth — admin login is in admin app |
| — | `/register` | [—] No student/alumni auth |
| — | `/forgot-password` | [—] No student/alumni auth |

> Note: `/alumni` static info page still exists and is fine as a soft presence.
> Login/register/forgot-password pages exist as code files but are orphaned — consider deleting.

---

## Summary

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Static (S) | 28 | 28 | 0 |
| Dynamic (D) | 17 | 9 | 8 |
| Form (F) | 3 | 1 | 2 |
| Media (M) | 3 | 2 | 1 |
| **Total** | **52** | **40** | **12** |

> **All static pages complete.** 12 remaining pages are dynamic/form/media that need backend API integration.
