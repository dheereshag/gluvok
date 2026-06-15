# Permissions Matrix

This document maps CRUD permissions (Read / Write / Delete) for each project entity per role.

Legend: Order is Read / Write (Create + Update) / Delete. ✅ = allowed, ❌ = denied.

Source: [lib/store/access.ts](lib/store/access.ts) (RBAC_MATRIX)

| Entity (slug) | SUPER_ADMIN | ADMIN | MANAGER | OPERATOR | BASE |
|---|---:|---:|---:|---:|---:|
| Users (users) | ✅/✅/✅ | ❌/❌/❌ | ❌/❌/❌ | ❌/❌/❌ | ❌/❌/❌ |
| Profiles (profiles) | ✅/✅/✅ | ✅/✅/✅ | ✅/✅/❌ | ❌/❌/❌ | ❌/❌/❌ |
| Villages (villages) | ✅/✅/✅ | ✅/❌/❌ | ✅/❌/❌ | ✅/❌/❌ | ❌/❌/❌ |
| Factories (factories) | ✅/✅/✅ | ✅/❌/❌ | ✅/❌/❌ | ✅/❌/❌ | ❌/❌/❌ |
| Centers (centers) | ✅/✅/✅ | ✅/❌/❌ | ✅/❌/❌ | ✅/❌/❌ | ❌/❌/❌ |
| Commodities (commodities) | ✅/✅/✅ | ✅/❌/❌ | ✅/❌/❌ | ✅/❌/❌ | ❌/❌/❌ |
| Rates (rates) | ✅/✅/✅ | ✅/✅/✅ | ✅/✅/❌ | ✅/❌/❌ | ❌/❌/❌ |
| Customers (customers) | ✅/✅/✅ | ✅/✅/✅ | ✅/✅/❌ | ✅/✅/❌ | ❌/❌/❌ |
| Weighments (weighments) | ✅/✅/✅ | ✅/✅/✅ | ✅/✅/❌ | ✅/✅/❌ | ✅/❌/❌ |

Notes:
- `Write` covers both Create and Update operations in the codebase (`write: boolean`).
- The matrix is authoritative as defined in `lib/store/access.ts`.

If you want this merged into the main `README.md` or exported as CSV/JSON, I can add that next.
