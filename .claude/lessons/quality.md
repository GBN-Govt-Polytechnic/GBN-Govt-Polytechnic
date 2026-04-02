# Quality Lessons

Patterns caught during quality reviews. Read by quality-gate and blueprint-architect before each task.

<!-- retro-learner appends new lessons here. Each lesson has a date and catch count. -->
<!-- Lessons older than 60 days with structural fixes applied should be archived. -->

### LESSON-001: Unsafe double type assertions on API response data
Date: 2026-04-02 | Caught: 1
**What:** Using `(res.data as unknown as AdminUser[])` bypasses TypeScript safety without runtime validation. If payload shape changes, the UI can fail or store invalid state.

**Where:** Admin/frontend pages that consume API responses directly into component state.

**Fix:** Use a type guard with runtime checks before setting state.
```typescript
function isAdminUser(item: unknown): item is AdminUser {
	if (typeof item !== "object" || item === null) return false;
	const user = item as Record<string, unknown>;
	return (
		typeof user.id === "string" &&
		typeof user.name === "string" &&
		typeof user.email === "string" &&
		typeof user.role === "string" &&
		typeof user.isActive === "boolean" &&
		typeof user.createdAt === "string"
	);
}

const users = Array.isArray(res.data) ? res.data.filter(isAdminUser) : [];
```

**Pattern:** Avoid `as unknown as` for API payloads. Prefer type guards and `Array.isArray` checks.

**Watch for:** Double assertions, unchecked response spreads, and direct state assignment from unvalidated API data.
