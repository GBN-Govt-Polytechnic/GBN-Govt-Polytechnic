---
paths:
  - "frontend/**/*.tsx"
  - "frontend/**/*.ts"
---

# Frontend Rules

## JSDoc Headers
Every file MUST have:
```tsx
/**
 * @fileoverview Brief description
 * @org GBN Polytechnic
 * @license ISC
 */
```

## Component Patterns
- Use shadcn/ui components from `components/ui/` — don't build custom primitives
- Add new shadcn components via: `cd frontend && bunx shadcn@latest add <component>`
- Styling: Tailwind utility classes only, no custom CSS unless absolutely necessary
- Icons: `lucide-react` only

## Pages & Routing
- Next.js App Router — pages in `src/app/`
- Static pages: default export, no data fetching
- Dynamic pages: use `fetch()` with ISR (`next: { revalidate: 60 }`)
- Site structure defined in `src/lib/config.ts` — update there first when adding nav items

## API Calls
- Use the typed wrapper in `src/lib/api.ts`
- API base URL from `NEXT_PUBLIC_API_URL` env var
- Handle loading/error states in components

## Key Files
- `src/lib/config.ts` — Nav links, department list, site metadata (start here for structure changes)
- `src/lib/api.ts` — API client
- `src/components/layout/` — Navbar, Footer (shared across all pages)
