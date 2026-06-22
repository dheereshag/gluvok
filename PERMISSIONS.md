# Permissions Matrix

This document maps CRUD permissions (Read / Write / Delete) for each project entity per role.

Legend: R = Read, W = Write (Create + Update), D = Delete. - = Denied.

Source: [lib/store/access.ts](lib/store/access.ts) (RBAC_MATRIX)

| Entity (slug) | SUPER_ADMIN | ADMIN | MANAGER | OPERATOR | BASE |
|---|---:|---:|---:|---:|---:|
| Users (users) | R, W, D | R | R | R | R |
| Profiles (profiles) | R, W, D | R, W, D | R, W | R | R |
| Villages (villages) | R, W, D | R | R | R | R |
| Factories (factories) | R, W, D | R, W, D | R | R | R |
| Centers (centers) | R, W, D | R, W, D | R | R | R |
| Commodities (commodities) | R, W, D | R | R | R | R |
| Rates (rates) | R, W, D | R, W, D | R, W | R | R |
| Customers (customers) | R, W, D | R, W, D | R, W | R, W | R |
| Weighments (weighments) | R, W, D | R, W, D | R, W | R, W | R |
| Assignments (assignments) | R, W, D | R, W, D | R | R | R |


Notes:
- `Write` covers both Create and Update operations in the codebase (`write: boolean`).
- The matrix is authoritative as defined in `lib/store/access.ts`.

If you want this merged into the main `README.md` or exported as CSV/JSON, I can add that next.
