---
paths:
  - "admin/**/*.tsx"
  - "admin/**/*.ts"
---

# Admin Panel Rules

## JSDoc Headers
Every file MUST have:
```tsx
/**
 * @fileoverview Brief description
 * @org GBN Polytechnic
 * @license ISC
 */
```

## Authentication
- `use-auth.tsx` provides `AuthProvider` and `useAuth()` hook
- All dashboard routes are protected — redirect to login if unauthenticated
- JWT tokens: access in memory, refresh in cookie
- Role checking: `useRole()` hook from `hooks/use-role.ts`

## CRUD Pages Pattern
Every resource page follows this structure:
1. List page with `DataTable` component (from `components/shared/`)
2. Create/Edit form in a dialog or separate page
3. Delete with `ConfirmDialog` component
4. File uploads via `FileUpload` component

## Shared Components (REUSE THESE)
- `components/shared/DataTable` — Sortable, filterable tables
- `components/shared/ConfirmDialog` — Delete/action confirmations
- `components/shared/FileUpload` — File upload with preview
- `components/ui/` — shadcn/ui primitives

## API Calls
- Use `lib/api.ts` which automatically attaches auth headers
- Types defined in `lib/types.ts`
- Toast notifications via `sonner` for success/error feedback

## Role-Based UI
- Check role before rendering sensitive actions
- SUPER_ADMIN sees everything
- HOD sees only their department's data
- TPO sees only placement-related pages
