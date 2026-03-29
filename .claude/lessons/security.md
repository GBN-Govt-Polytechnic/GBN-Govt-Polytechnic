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
Date: 2026-03-26 | Catch count: 3 (2026-03-26, 2026-03-29, 2026-03-29)
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
Date: 2026-03-26 | Catch count: 2 (2026-03-26, 2026-03-29)
What: Authenticated file upload POST/PUT endpoints had no strictLimiter, relying only on
      the global 100/min limiter. Allows storage exhaustion by authenticated users.
Where: faculty, news, hero-slides, mous, achievements, results, resources routes
Fix: Added strictLimiter to all POST/PUT with file uploads across affected route files.
Watch for: Any route using imageUpload/documentUpload/mediaUpload without a strictLimiter.

### LESSON-006: Public form schemas missing max-length constraints
Date: 2026-03-26 | Catch count: 2 (2026-03-26, 2026-03-29)
What: createContactSchema and createComplaintSchema had no .max() bounds, enabling
      database bloat attacks and expensive email notifications via large message bodies.
Where: backend/src/features/submissions/submissions.schema.ts
Fix: Added max(100) on name, max(200) on subject, max(5000) on message, max(254) on email.
Watch for: Any public-facing Zod schema with z.string().min(1) but no .max() bound.
Also found in: registerStudentSchema (auth.schema.ts) — rollNo, name, phone have no .max().

### LESSON-007: No account lockout after failed login attempts
Date: 2026-03-29 | Catch count: 1
What: Login endpoint has rate limiting per IP (authLimiter 10/min) but no per-account lockout.
      An attacker rotating IPs can brute-force a known email indefinitely.
Where: backend/src/features/auth/auth.service.ts (login function)
Fix: PENDING — Add failed_login_count + locked_until fields to AdminUser/Student models.
     Lock account after 5-10 failures for 15-30 minutes.
Watch for: Any authentication endpoint without per-account failure tracking.

### LESSON-008: Refresh token family detection missing
Date: 2026-03-29 | Catch count: 1
What: Refresh tokens are rotated (used token revoked, new one issued) but there is no
      family/chain tracking. If an attacker steals a token and uses it after the legitimate
      user has already rotated, the system doesn't detect the replay and doesn't revoke all
      sibling tokens in the rotation chain. RFC 6819 §5.2.2.3 recommends family detection.
Where: backend/src/features/auth/auth.service.ts (refresh function), RefreshToken model
Fix: PENDING — Add a `familyId` field to RefreshToken. On replay of a revoked token,
     revoke ALL tokens in that family (signals compromise).
Watch for: Any refresh token rotation without chain/family tracking.

### LESSON-009: JWT payload perpetuates stale role data on refresh rotation
Date: 2026-03-29 | Catch count: 1
What: When a refresh token is rotated, the new token payload is built from the OLD JWT
      claims (decoded from the used refresh token) instead of re-querying the database.
      If a SUPER_ADMIN changes a user's role or departmentId, the change isn't reflected
      in rotated tokens until the user performs a full logout/login.
Where: backend/src/features/auth/auth.service.ts (refresh function, lines ~242-248)
Fix: PENDING — Re-query AdminUser/Student table during refresh to get current role/dept.
Watch for: Any token rotation that reconstructs claims from the old token instead of DB.

### LESSON-010: Login endpoint uses wrong rate limit tier
Date: 2026-03-29 | Catch count: 1
What: POST /auth/login uses authLimiter (10/min) instead of strictLimiter (5/min).
      Login is the most abuse-prone endpoint and should use the strictest tier.
Where: backend/src/features/auth/auth.routes.ts:20
Fix: PENDING — Change authLimiter to strictLimiter on the login route.
Watch for: Security-critical endpoints using lenient rate limit tiers.

### LESSON-011: Student self-registration has no enrollment verification
Date: 2026-03-29 | Catch count: 1
What: POST /auth/register/student accepts any rollNo string without verifying it against
      an institution roster. Anyone can create student accounts with arbitrary enrollment
      numbers, potentially squatting real students' identities.
Where: backend/src/features/auth/auth.service.ts (registerStudent), auth.schema.ts
Fix: PENDING — Either require admin-approved pre-enrollment list, OTP to institutional
     email, or disable self-registration until verification is implemented.
Watch for: Any public registration endpoint that accepts institution-issued identifiers
           without out-of-band verification.

### LESSON-012: Soft-delete bypass via direct ID lookup
Date: 2026-03-29 | Catch count: 1
What: Gallery album findAlbumById uses prisma.findUnique({ where: { id } }) without
      filtering deletedAt: null. Soft-deleted albums are accessible via GET /gallery/:id
      (public endpoint) and can be updated/images-added by admin endpoints.
Where: backend/src/features/content/gallery/gallery.service.ts:50-58
Fix: PENDING — Add deletedAt: null to findAlbumById and all other findUnique calls on
     soft-deletable models.
Watch for: Any findUnique/findFirst call on a soft-deletable model that omits the
           deletedAt: null filter. Especially dangerous on public GET /:id routes.

### LESSON-013: `isPublic = !req.user` guard requires optionalAuth middleware
Date: 2026-03-29 | Catch count: 1
What: Gallery and news controllers use `const isPublic = !req.user` to differentiate
      public vs admin views. But the GET routes have no optionalAuth middleware, so
      req.user is ALWAYS undefined and isPublic is ALWAYS true — even for authenticated admins.
Where: backend/src/features/content/gallery/gallery.controller.ts:20-23,
       backend/src/features/content/news/news.controller.ts:23
Fix: PENDING — Add optionalAuth middleware to public list routes that use this pattern.
Watch for: Any controller using `req.user` on a route without authenticate or optionalAuth.

### LESSON-014: Mass assignment via input spread in Prisma create/update
Date: 2026-03-29 | Catch count: 1
What: Several services spread Zod-validated input directly into Prisma operations:
      `prisma.*.create({ data: input })` or `data: { ...input }`. While currently safe
      because Zod schemas don't include system fields, if schemas ever grow to include
      fields like id, isActive, deletedAt, createdAt, those would be passed through.
Where: courses.service.ts, labs.service.ts, resources.service.ts, placements.service.ts,
       documents.service.ts — all create/update functions
Fix: PENDING — Use explicit field mapping (like faculty.service.ts does) instead of spreads.
Watch for: Any `prisma.*.create({ data: input })` or `{ ...input }` spread from user input.

### LESSON-015: multer@1.x has known ReDoS vulnerability
Date: 2026-03-29 | Catch count: 1
What: multer@1.4.5-lts.2 has known ReDoS risk via malformed multipart Content-Type
      boundary parsing. Crafted headers can block the event loop.
Where: backend/package.json (multer dependency)
Fix: PENDING — Upgrade to multer@2.x or add a pre-parser boundary validation middleware.
Watch for: multer version in package.json — ensure 2.x or later.

### LESSON-016: Error handler leaks DB column names in Prisma P2002 errors
Date: 2026-03-29 | Catch count: 1
What: Prisma unique constraint errors (P2002) return the actual column name(s) from
      err.meta.target directly in the error response message to the client.
Where: backend/src/middleware/error-handler.ts:82-85
Fix: PENDING — Map known constraint targets to user-friendly messages; return generic
     "already exists" for unknown targets.
Watch for: Any error handler that includes raw Prisma meta fields in client-facing responses.

### LESSON-017: MinIO unencrypted by default + bucket policy concerns
Date: 2026-03-29 | Catch count: 1
What: MINIO_USE_SSL defaults to false. Traffic between backend and MinIO is unencrypted.
      The bucket policy is s3:GetObject for Principal:* — all objects publicly readable
      if key is known. No per-prefix ACL exists. Safe for public assets but dangerous
      if any feature uploads private/sensitive documents.
Where: backend/src/config/env.ts (MINIO_USE_SSL), backend/src/lib/minio.ts (bucket policy)
Fix: PENDING — Consider separate private bucket with signed URLs for non-public uploads.
     Add MINIO_USE_SSL=true to production .env template.
Watch for: Any new feature that uploads files that should NOT be publicly accessible.

### LESSON-018: GET /users endpoint missing Zod query validation
Date: 2026-03-29 | Catch count: 1
What: The GET /users route has no validate({ query: ... }) middleware. The role filter
      and pagination params are passed as unvalidated strings from req.query.
Where: backend/src/features/users/users.routes.ts:21
Fix: PENDING — Add a userQuerySchema with Zod and apply validate middleware.
Watch for: Any GET route with query parameters that lacks validate({ query: ... }).
