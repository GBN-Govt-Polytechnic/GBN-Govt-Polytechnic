# Architecture & Pattern Lessons

Decisions that worked or failed. Read by blueprint-architect before planning.

<!-- retro-learner appends new lessons here. Each lesson has a date. -->
<!-- Review periodically — patterns may become outdated as the project evolves. -->

### PATTERN-001: checkDepartmentAccess on root vs child resources
Date: 2026-03-29
What: When calling `checkDepartmentAccess(user, resourceDepartmentId)`:
  - For child entities (faculty, courses, labs): pass `entity.departmentId` (the FK)
  - For the Department entity itself: pass `entity.id` (the PK, since it IS the department)
This works "by accident" in departments.controller.ts but is a non-obvious pattern.
Decision: Document explicitly in department-scope.ts JSDoc. Future features should follow
          the same convention — always pass the departmentId that identifies the department,
          regardless of whether it's a PK or FK on the entity being checked.

### PATTERN-002: Defense-in-depth for department scope
Date: 2026-03-29
What: The requireDepartmentScope() middleware only checks req.body/req.query, NOT route
      params or the resource's actual department. This means on PUT /:id routes, the
      middleware can be bypassed by omitting departmentId from the body.
Decision: Service-layer checkDepartmentAccess is the real enforcement. The middleware is
          only a first-pass filter for create operations (where departmentId is in body).
          Both layers MUST always be present on department-scoped write routes.
          Consider: a shared middleware that combines authenticate + requireRole + deptScope.

### PATTERN-003: Explicit field mapping vs input spread for Prisma operations
Date: 2026-03-29
What: Two patterns exist in the codebase:
  - SAFE: faculty.service.ts — maps each field explicitly to prisma.create({ data: { name: input.name, ... } })
  - RISKY: courses.service.ts — spreads entire input: prisma.create({ data: input })
Decision: Prefer explicit field mapping for all Prisma create/update operations.
          The spread pattern relies on Zod schema discipline to never include system fields.
          Explicit mapping is defense-in-depth against schema evolution mistakes.
