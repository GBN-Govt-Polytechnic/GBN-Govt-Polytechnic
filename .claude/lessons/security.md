# Security Lessons

Patterns caught during security reviews. Read by security-sentinel and blueprint-architect before each task.

<!-- retro-learner appends new lessons here. Each lesson has a date and catch count. -->
<!-- Lessons older than 60 days with structural fixes applied should be archived. -->

### LESSON-001: Weak seed credentials in .env
Date: 2026-03-26 | Catch count: 1
What: backend/.env contained ADMIN_PASSWORD=123456789 — trivially brute-forceable.
Where: backend/.env + backend/prisma/seed.ts
Fix: Added minimum length (>=16) check in seed.ts. Use `openssl rand -base64 24` to generate.
Watch for: Any ADMIN_PASSWORD or DEFAULT_PASSWORD value that looks like a simple number or word.

### LESSON-002: Docker-compose fallback secrets that bypass Zod validation
Date: 2026-03-26 | Catch count: 1
What: JWT secret defaults like "replace-this-with-a-very-long-jwt-secret-min-32-chars" are
      >32 chars so they pass the Zod min(32) check, yet they are publicly known.
Where: docker-compose.yml + backend/src/config/env.ts
Fix: Added "replace-this" prefix rejection to Zod refinements; changed docker-compose
     to use :? syntax that fails loudly if JWT_SECRET is not set.
Watch for: Any default value in docker-compose that is long enough to pass length checks
           but is obviously a placeholder string.

### LESSON-003: In-memory rate limiting in multi-instance backends
Date: 2026-03-26 | Catch count: 1
What: RateLimiterMemory does not share state across processes/containers. Rate limits reset
      on restart and are bypassed by distributing requests across instances.
Where: backend/src/middleware/rate-limit.ts
Fix: PENDING — use RateLimiterPostgres or RateLimiterRedis for shared state.
Watch for: Any new RateLimiterMemory instantiation in a service meant to run replicated.

### LESSON-004: JWT tokens stored in localStorage (XSS theft)
Date: 2026-03-26 | Catch count: 1
What: admin/src/lib/api.ts stores both access and refresh tokens in localStorage,
      accessible to any JavaScript including XSS payloads.
Where: admin/src/lib/api.ts
Fix: PENDING — Access token in memory; refresh token in httpOnly SameSite=Strict cookie.
Watch for: Any localStorage.setItem call storing tokens or session identifiers.

### LESSON-005: File upload routes missing per-route rate limiters
Date: 2026-03-26 | Catch count: 1
What: Authenticated file upload POST/PUT endpoints had no strictLimiter, relying only on
      the global 100/min limiter. Allows storage exhaustion by authenticated users.
Where: faculty, news, hero-slides, mous, achievements, results, resources routes
Fix: Added strictLimiter to all POST/PUT with file uploads across affected route files.
Watch for: Any route using imageUpload/documentUpload/mediaUpload without a strictLimiter.

### LESSON-006: Public form schemas missing max-length constraints
Date: 2026-03-26 | Catch count: 1
What: createContactSchema and createComplaintSchema had no .max() bounds, enabling
      database bloat attacks and expensive email notifications via large message bodies.
Where: backend/src/features/submissions/submissions.schema.ts
Fix: Added max(100) on name, max(200) on subject, max(5000) on message, max(254) on email.
Watch for: Any public-facing Zod schema with z.string().min(1) but no .max() bound.
