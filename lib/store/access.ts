import { Role } from "@/lib/constants/enums"
import { ProjectSlug } from "@/lib/constants/enums"

export interface Permission {
  /** Whether this role can query records from this entity table */
  read: boolean
  /** Whether this role can write/update records in this entity table */
  write: boolean
  /** Whether this role can delete records from this entity table */
  delete: boolean
  /** Whether this role can create new records in this entity table */
  create: boolean
  /** Whether this role should see this entity page in the dashboard/sidebar */
  show: boolean
}

export const RBAC_MATRIX: Record<Role, Record<ProjectSlug, Permission>> = {
  [Role.SUPER_ADMIN]: {
    [ProjectSlug.PROFILES]:    { read: true, write: true, delete: true,  create: true,  show: true },
    [ProjectSlug.VILLAGES]:    { read: true, write: true, delete: true,  create: true,  show: true },
    [ProjectSlug.FACTORIES]:   { read: true, write: true, delete: true,  create: true,  show: true },
    [ProjectSlug.CENTERS]:     { read: true, write: true, delete: true,  create: true,  show: true },
    [ProjectSlug.COMMODITIES]: { read: true, write: true, delete: true,  create: true,  show: true },
    [ProjectSlug.RATES]:       { read: true, write: true, delete: true,  create: true,  show: true },
    [ProjectSlug.CUSTOMERS]:   { read: true, write: true, delete: true,  create: true,  show: true },
    [ProjectSlug.WEIGHMENTS]:  { read: true, write: true, delete: true,  create: true,  show: true },
  },
  [Role.ADMIN]: {
    [ProjectSlug.PROFILES]:    { read: true, write: true,  delete: true,  create: true,  show: true },
    [ProjectSlug.VILLAGES]:    { read: true, write: false, delete: false, create: false, show: true },
    [ProjectSlug.FACTORIES]:   { read: true, write: true,  delete: true,  create: false, show: true }, // Can edit/delete, but not create new factories
    [ProjectSlug.CENTERS]:     { read: true, write: true,  delete: true,  create: true,  show: true },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false, create: false, show: true },
    [ProjectSlug.RATES]:       { read: true, write: true,  delete: true,  create: true,  show: true },
    [ProjectSlug.CUSTOMERS]:   { read: true, write: true,  delete: true,  create: true,  show: true },
    [ProjectSlug.WEIGHMENTS]:  { read: true, write: true,  delete: true,  create: true,  show: true },
  },
  [Role.MANAGER]: {
    [ProjectSlug.PROFILES]:    { read: true, write: true,  delete: false, create: true,  show: true },
    [ProjectSlug.VILLAGES]:    { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.FACTORIES]:   { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.CENTERS]:     { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.RATES]:       { read: true, write: true,  delete: false, create: true,  show: true },
    [ProjectSlug.CUSTOMERS]:   { read: true, write: true,  delete: false, create: true,  show: true },
    [ProjectSlug.WEIGHMENTS]:  { read: true, write: true,  delete: false, create: true,  show: true },
  },
  [Role.OPERATOR]: {
    [ProjectSlug.PROFILES]:    { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.VILLAGES]:    { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.FACTORIES]:   { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.CENTERS]:     { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.RATES]:       { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.CUSTOMERS]:   { read: true, write: true,  delete: false, create: true,  show: true },
    [ProjectSlug.WEIGHMENTS]:  { read: true, write: true,  delete: false, create: true,  show: true },
  },
  [Role.BASE]: {
    [ProjectSlug.PROFILES]:    { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.VILLAGES]:    { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.FACTORIES]:   { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.CENTERS]:     { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.RATES]:       { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.CUSTOMERS]:   { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.WEIGHMENTS]:  { read: true, write: false, delete: false, create: false, show: false },
  },
  [Role.HARDWARE]: {
    [ProjectSlug.PROFILES]:    { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.VILLAGES]:    { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.FACTORIES]:   { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.CENTERS]:     { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.RATES]:       { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.CUSTOMERS]:   { read: true, write: false, delete: false, create: false, show: false },
    [ProjectSlug.WEIGHMENTS]:  { read: true, write: false, delete: false, create: true,  show: true },
  },
}

export function getPermissions(role: Role | null | undefined, projectSlug: string): Permission {
  if (!role) {
    return { read: false, write: false, delete: false, create: false, show: false }
  }
  return RBAC_MATRIX[role]?.[projectSlug as ProjectSlug] || { read: false, write: false, delete: false, create: false, show: false }
}

/**
 * Whether this role should see this project page in the dashboard and sidebar.
 * Uses the `show` permission, which is distinct from `read` (DB query access)
 * and `write` (mutation access).
 */
export function hasPageAccess(role: Role | null | undefined, projectSlug: string): boolean {
  return getPermissions(role, projectSlug).show
}

export function hasCreateAccess(role: Role | null | undefined, projectSlug: string): boolean {
  return getPermissions(role, projectSlug).create
}

export function hasDeleteAccess(role: Role | null | undefined, projectSlug: string): boolean {
  return getPermissions(role, projectSlug).delete
}
