# Sitemap — GBN Govt. Polytechnic, Nilokheri

> Maps old site pages (gpnilokheri.ac.in) to new V2 routes.
> **Status:** `✅` = Implemented · `🔲` = Not yet · `❌` = Removed from scope
> **Type:** **S** = Static · **D** = Dynamic · **F** = Form · **M** = Media

---

## 1. Public Site (Frontend — Next.js · Port 3000)

### 1.1 Home & General

| Route | Type | Status | Old Page | Description |
|-------|------|--------|----------|-------------|
| `/` | D | ✅ | Default.aspx | Homepage — hero slider, stats, quick links, departments |
| `/about` | S | ✅ | Institute.aspx | History, quality policy, vision/mission |
| `/about/principal` | S | ✅ | Principal.aspx | Principal's desk |
| `/about/infrastructure` | S | ✅ | Infrastructure.aspx | Labs/facilities listing |
| `/about/achievements` | D | ✅ | Achievements.aspx | Awards, achievements |
| `/about/green-campus` | S | ✅ | GreenBuildings.aspx | Green campus initiatives |
| `/about/mandatory-disclosure` | M | ✅ | MandatoryDisclosure.aspx | PDF download |
| `/about/iqac` | S | ✅ | IQAC.aspx | IQAC committee |
| `/about/location` | S | ✅ | LocationMap.aspx | Google Maps embed |
| `/about/mou` | S | ✅ | MOU.aspx | MOU list |
| `/about/nep` | S | ✅ | NEP.aspx | NEP 2020 info |

### 1.2 Academics

| Route | Type | Status | Old Page | Description |
|-------|------|--------|----------|-------------|
| `/academics` | S | ✅ | Academic.aspx | Academic overview |
| `/academics/courses` | S | ✅ | CoursesOffered.aspx | 8 departments, intake, eligibility |
| `/academics/syllabus` | D | 🔲 | Syllabus.aspx | Syllabus PDFs per department |
| `/academics/timetable` | D | 🔲 | timetable.aspx | Timetable PDFs per department |
| `/academics/results` | D | ✅ | Result2021.aspx | Exam results (placeholder) |
| `/academics/scholarships` | S | ✅ | Scholarship.aspx | Scholarship schemes |
| `/academics/resources` | S | ✅ | learning.aspx | E-learning portal links |

### 1.3 Departments (×8 departments incl. Workshop)

| Route | Type | Status | Old Pages | Description |
|-------|------|--------|-----------|-------------|
| `/departments` | S | ✅ | — | Department index |
| `/departments/[slug]` | D | ✅ | Abt_*.aspx, FL_*.aspx | Department detail: about, faculty, labs |

**Department slugs:** `cse`, `ece`, `ee`, `ce`, `me`, `ice`, `as`, `ws`

> Old site had separate pages per dept for study materials (SM_*), lesson plans (LP_*), vision/mission (VM_*). In V2, these are accessed via API from the department detail page or dedicated resource pages.

### 1.4 Placement & Training

| Route | Type | Status | Old Page | Description |
|-------|------|--------|----------|-------------|
| `/placement` | D | ✅ | Placement.aspx | Placement stats overview |
| `/placement/companies` | D | 🔲 | RecruitingCompaniesGBN.htm | Company list with packages |
| `/placement/activities` | D | 🔲 | PlActivities.aspx | TPO reports |
| `/placement/visits` | D | 🔲 | Ind_Visits.aspx | Industrial visit records |
| `/placement/apprenticeship` | S | ✅ | Apprenticeship.aspx | NAPS scheme info |
| `/placement/contact` | F | 🔲 | PlacementContactForm.aspx | Student placement form |

### 1.5 Campus Life

| Route | Type | Status | Old Page | Description |
|-------|------|--------|----------|-------------|
| `/gallery` | D | ✅ | Gallery.aspx | Photo gallery albums |
| `/gallery/[id]` | D | ✅ | — | Individual album detail |
| `/campus/events` | D | 🔲 | CulturalActivities.aspx | Cultural events |
| `/campus/ncc` | S | ✅ | NCC.aspx | NCC activities |
| `/campus/innovation` | S | ✅ | InnovationClub.aspx | Innovation club |

### 1.6 News

| Route | Type | Status | Old Page | Description |
|-------|------|--------|----------|-------------|
| `/news` | D | ✅ | NewsAndEvents.aspx | News/notice listing |
| `/news/[slug]` | D | ✅ | — | News detail |

### 1.7 Committees & Cells

| Route | Type | Status | Old Page | Description |
|-------|------|--------|----------|-------------|
| `/committees/anti-ragging` | S | ✅ | Ragging.aspx | Anti-ragging rules |
| `/committees/icc` | S | ✅ | Complaint.aspx | Internal Complaint Committee |
| `/committees/grievance` | S | ✅ | grivience.aspx | Grievance Redressal |
| `/committees/discipline` | S | ✅ | Discipline.aspx | Discipline Committee |
| `/committees/sc-st` | S | ✅ | SCST.aspx | SC/ST Committee |

### 1.8 Admissions

| Route | Type | Status | Old Page | Description |
|-------|------|--------|----------|-------------|
| `/admissions` | S | ✅ | AdmissionContact.aspx | Admission process + contacts |
| `/admissions/status` | D | 🔲 | AdmissionStatus.aspx | Seat availability |

### 1.9 Contact & Support

| Route | Type | Status | Old Page | Description |
|-------|------|--------|----------|-------------|
| `/contact` | F | ✅ | ContactUs.aspx | Contact form + info |
| `/contact/industry` | F | 🔲 | IndustryContactForm.aspx | Industry inquiry form |
| `/contact/helpline` | S | ✅ | helpline.aspx | Helpline numbers |

### 1.10 Rules & Policies

| Route | Type | Status | Old Page | Description |
|-------|------|--------|----------|-------------|
| `/rules` | S | ✅ | Ragging.aspx + others | Combined rules page |
| `/rules/code-of-conduct` | M | ✅ | conduct_student.aspx | Conduct PDF |

### 1.11 Resources & Services

| Route | Type | Status | Old Page | Description |
|-------|------|--------|----------|-------------|
| `/services/faculty` | S | ✅ | eservices.aspx | Faculty e-services |
| `/services/students` | S | ✅ | eservicesstud.aspx | Student e-services |
| `/documents` | M | 🔲 | AffiliationPerforma.aspx | Downloadable documents |
| `/feedback` | S | ✅ | StudentFeedback.aspx | AICTE feedback link |
| `/mhrd` | S | ✅ | MHRD.aspx | Govt. projects |

### 1.12 Misc (New in V2)

| Route | Type | Status | Description |
|-------|------|--------|-------------|
| `/developer` | S | ✅ | Developer credits |
| `/site-map` | S | ✅ | HTML sitemap |
| `/alumni` | S | ✅ | Alumni association info (static) |

### 1.13 Removed from V2 Scope

| Old Route | Old Page | Reason |
|-----------|----------|--------|
| `/alumni/register` | AlumniForm.aspx | ❌ Alumni feature removed — separate site |
| `/alumni/directory` | AlumniDetails.aspx | ❌ Alumni feature removed |
| `/login`, `/register` | — | ❌ No student/alumni auth; admin uses admin app |
| `/campus/videos` | videos.aspx | ❌ Not building video gallery |
| `/staff/teaching` | TeachingStaff.aspx | ❌ Faculty shown per department instead |
| `/staff/non-teaching` | OfficeStaff.aspx | ❌ Not a separate page |
| `/staff/guest-faculty` | GuestFaculty.aspx | ❌ Not a separate page |
| `/staff/research` | Research.aspx | ❌ Not building |
| `/tenders` | tenders.aspx | ❌ Tenders shown in news (category filter) |

---

## 2. CMS / Admin Panel (Next.js · Port 3001)

| Route | Status | Description | Roles |
|-------|--------|-------------|-------|
| `/login` | ✅ | Admin login | — |
| `/` (dashboard) | ✅ | Stats overview | All |
| `/departments` | ✅ | Department CRUD | Admin, HOD |
| `/faculty` | ✅ | Faculty CRUD + photo upload | Admin, HOD |
| `/courses` | ✅ | Course management | Admin, HOD |
| `/labs` | ✅ | Lab management | Admin, HOD |
| `/study-materials` | ✅ | Study material upload | HOD |
| `/lesson-plans` | ✅ | Lesson plan upload | HOD |
| `/syllabus` | ✅ | Syllabus upload | HOD |
| `/news` | ✅ | News/notices CRUD | Admin, News Editor |
| `/events` | ✅ | Events CRUD | Admin, Media Manager |
| `/achievements` | ✅ | Achievement CRUD | Admin |
| `/gallery` | ✅ | Album + batch image upload | Admin, Media Manager |
| `/hero-slides` | ✅ | Homepage slider management | Admin |
| `/placement/records` | ✅ | Placement stats CRUD | Admin, TPO |
| `/placement/companies` | ✅ | Recruiting companies CRUD | Admin, TPO |
| `/placement/activities` | ✅ | Placement activities | Admin, TPO |
| `/users` | ✅ | User management | Super Admin |
| `/submissions` | ✅ | View contact/complaint forms | Admin |
| `/logs` | ✅ | Audit log viewer | Super Admin |
| `/backup` | ✅ | Backup management (UI only) | Super Admin |
| `/timetables` | ❌ | Removed from scope |
| `/settings` | ❌ | Removed from scope |

---

## 3. Page Count Summary

| | Implemented | Remaining | Removed | Total Planned |
|---|---|---|---|---|
| **Frontend (Public)** | 40 | 12 | 9 | 52 active |
| **Admin (CMS)** | 21 | 0 | 2 | 21 |
| **Total** | **61** | **12** | **11** | **73 active** |

> **Original old site:** 95 ASP.NET pages → consolidated into 73 active routes across 2 apps.
