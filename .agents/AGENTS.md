# Antigravity System Directives & Standards

## Verification & Tool Commands
Always use **pnpm** (never raw npm or yarn) for all CLI checks, test executions, linting, type checks, and builds in this codebase:
- **Unit Testing**: `pnpm test`
- **TypeScript Type Checking**: `pnpm exec tsc --noEmit`
- **Linting**: `pnpm lint`
- **Production Build Validation**: `pnpm build`

## Codebase Standards
1. **DRY & Reusable Helpers**: Extract repetitive database query filters, search ID extraction logic, and shared UI controls into clean utility functions/components.
2. **Use Enums Over Raw Strings**: Always import and use `EntityKey` (e.g. `EntityKey.CREATED_AT`, `EntityKey.UPDATED_AT`, `EntityKey.ID`) instead of hardcoding raw column strings.
