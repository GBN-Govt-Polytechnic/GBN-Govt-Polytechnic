---
paths:
  - "backend/prisma/**"
---

# Database & Prisma Rules

## Schema Location
`backend/prisma/schema.prisma` is the single source of truth for the data model.

## Common Commands
```bash
cd backend
bunx prisma migrate dev --name describe_change   # Create + apply migration
bunx prisma generate                              # Regenerate client after schema change
bunx prisma db seed                               # Run seed script
bunx prisma studio                                # Visual DB browser on :5555
bunx prisma migrate reset                         # DESTRUCTIVE: reset DB + re-seed
```

## Schema Conventions
- Model names: PascalCase singular (`Faculty`, not `Faculties`)
- Field names: camelCase
- Enum values: SCREAMING_SNAKE_CASE
- Relations: explicit `@relation` with named foreign keys
- Timestamps: `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`
- Soft deletes: `deletedAt DateTime?` where applicable
- Content lifecycle: `status ContentStatus @default(DRAFT)` → DRAFT, PUBLISHED, ARCHIVED

## Key Enums
- `AdminRole`: SUPER_ADMIN, ADMIN, HOD, TPO, MEDIA_MANAGER, NEWS_EDITOR
- `ContentStatus`: DRAFT, PUBLISHED, ARCHIVED
- `NewsCategory`: NEWS, NOTICE, CIRCULAR, TENDER
- `CourseType`: THEORY, PRACTICAL, ELECTIVE
