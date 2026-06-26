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

Notes:
- `Write` covers both Create and Update operations in the codebase (`write: boolean`).
- The matrix is authoritative as defined in `lib/store/access.ts`.

### Data Isolation (Row Level Security)
- **Multi-Tenant Model:** The application implements a multi-tenant isolation strategy based on `factory_id`.
- **Super Admin Bypass:** The `SUPER_ADMIN` role has unrestricted access and bypasses all `factory_id` filters.
- **Factory Scope:** `Profiles`, `Customers`, `Centers`, `Rates`, and `Weighments` are strictly isolated so users can only access data belonging to their assigned `factory_id`.
- **Factory Entities:** `ADMIN` users can only edit their own assigned factory and cannot create new ones.
- **Weighments for Customers:** Customers can only view weighment records where `weighment.customer_id` matches their own `customer_id`.
