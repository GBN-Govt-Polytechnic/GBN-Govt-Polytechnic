---
paths:
  - "backend/**/*.ts"
---

# Backend Rules

## File Structure
Every feature module follows: `*.routes.ts` → `*.controller.ts` → `*.service.ts` → `*.schema.ts`
- Routes define endpoints and wire middleware
- Controllers handle req/res, call services
- Services contain business logic, call Prisma
- Schemas define Zod validation

## JSDoc Documentation
Every file MUST have a header:
```ts
/**
 * @fileoverview Brief description
 * @org GBN Polytechnic
 * @license ISC
 */
```
Every exported function MUST have JSDoc with `@param`, `@returns`, `@throws`.

## API Patterns
- Use `ApiResponse.success(res, data)` / `.created()` / `.paginated()` / `.noContent()` for responses
- Throw `new ApiError(statusCode, message)` for errors — global handler catches them
- Validate all input with Zod schemas via `validate` middleware
- Paginate list endpoints using `pagination.ts` helper
- Generate slugs with `slug.ts` utility

## Auth & RBAC
- `authenticate` middleware verifies JWT
- `requireRole(AdminRole.ADMIN)` checks role level
- `departmentScope` restricts HODs to their department
- SUPER_ADMIN bypasses all role checks
- Role hierarchy: SUPER_ADMIN > ADMIN > HOD > TPO > MEDIA_MANAGER > NEWS_EDITOR

## File Uploads
- Use `upload` middleware (Multer in-memory) → then upload to MinIO via `services/s3.ts`
- Validate file type with `file-type` package
- Store file URL in database model

## Database
- Schema source of truth: `backend/prisma/schema.prisma`
- After schema changes: `bunx prisma migrate dev --name description`
- Soft deletes where applicable (check for `deletedAt` field)
- Use Prisma's include/select for query optimization
