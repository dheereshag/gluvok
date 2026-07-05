/**
 * @file lib/store/access.ts
 * @description Zustand state store or helper for managing access data.
 */

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
  /** Whether this role can use filters in the table toolbar */
  filter: boolean
}

export const RBAC_MATRIX: Record<Role, Record<ProjectSlug, Permission>> = {
  [Role.SUPER_ADMIN]: {
    [ProjectSlug.PROFILES]:    { read: true, write: true, delete: true,  create: true,  show: true, filter: true },
    [ProjectSlug.FACTORIES]:   { read: true, write: true, delete: true,  create: true,  show: true, filter: true },
    [ProjectSlug.CENTERS]:     { read: true, write: true, delete: true,  create: true,  show: true, filter: true },
    [ProjectSlug.COMMODITIES]: { read: true, write: true, delete: true,  create: true,  show: true, filter: true },
    [ProjectSlug.RATES]:       { read: true, write: true, delete: true,  create: true,  show: true, filter: true },
    [ProjectSlug.CUSTOMERS]:   { read: true, write: true, delete: true,  create: true,  show: true, filter: true },
    [ProjectSlug.WEIGHMENTS]:  { read: true, write: true, delete: true,  create: true,  show: true, filter: true },
  },
  [Role.ADMIN]: {
    [ProjectSlug.PROFILES]:    { read: true, write: true,  delete: true,  create: true,  show: true,  filter: true },
    [ProjectSlug.FACTORIES]:   { read: true, write: true,  delete: true,  create: false, show: true,  filter: false },
    [ProjectSlug.CENTERS]:     { read: true, write: true,  delete: true,  create: true,  show: true,  filter: false },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false, create: false, show: true,  filter: true },
    [ProjectSlug.RATES]:       { read: true, write: true,  delete: true,  create: true,  show: true,  filter: true },
    [ProjectSlug.CUSTOMERS]:   { read: true, write: true,  delete: true,  create: true,  show: true,  filter: true },
    [ProjectSlug.WEIGHMENTS]:  { read: true, write: true,  delete: true,  create: true,  show: true,  filter: true },
  },
  [Role.MANAGER]: {
    [ProjectSlug.PROFILES]:    { read: true, write: true,  delete: false, create: true,  show: true,  filter: true },
    [ProjectSlug.FACTORIES]:   { read: true, write: false, delete: false, create: false, show: false, filter: false },
    [ProjectSlug.CENTERS]:     { read: true, write: false, delete: false, create: false, show: false, filter: false },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false, create: false, show: false, filter: true },
    [ProjectSlug.RATES]:       { read: true, write: true,  delete: false, create: true,  show: true,  filter: true },
    [ProjectSlug.CUSTOMERS]:   { read: true, write: true,  delete: false, create: true,  show: true,  filter: true },
    [ProjectSlug.WEIGHMENTS]:  { read: true, write: true,  delete: false, create: true,  show: true,  filter: true },
  },
  [Role.OPERATOR]: {
    [ProjectSlug.PROFILES]:    { read: true, write: false, delete: false, create: false, show: false, filter: true },
    [ProjectSlug.FACTORIES]:   { read: true, write: false, delete: false, create: false, show: false, filter: false },
    [ProjectSlug.CENTERS]:     { read: true, write: false, delete: false, create: false, show: false, filter: false },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false, create: false, show: false, filter: true },
    [ProjectSlug.RATES]:       { read: true, write: false, delete: false, create: false, show: false, filter: true },
    [ProjectSlug.CUSTOMERS]:   { read: true, write: true,  delete: false, create: true,  show: true,  filter: true },
    [ProjectSlug.WEIGHMENTS]:  { read: true, write: true,  delete: false, create: true,  show: true,  filter: true },
  },
  [Role.BASE]: {
    [ProjectSlug.PROFILES]:    { read: true, write: false, delete: false, create: false, show: false, filter: true },
    [ProjectSlug.FACTORIES]:   { read: true, write: false, delete: false, create: false, show: false, filter: false },
    [ProjectSlug.CENTERS]:     { read: true, write: false, delete: false, create: false, show: false, filter: false },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false, create: false, show: false, filter: true },
    [ProjectSlug.RATES]:       { read: true, write: false, delete: false, create: false, show: false, filter: true },
    [ProjectSlug.CUSTOMERS]:   { read: true, write: false, delete: false, create: false, show: false, filter: true },
    [ProjectSlug.WEIGHMENTS]:  { read: true, write: false, delete: false, create: false, show: true,  filter: true },
  },
  [Role.HARDWARE]: {
    [ProjectSlug.PROFILES]:    { read: true, write: false, delete: false, create: false, show: false, filter: true },
    [ProjectSlug.FACTORIES]:   { read: true, write: false, delete: false, create: false, show: false, filter: false },
    [ProjectSlug.CENTERS]:     { read: true, write: false, delete: false, create: false, show: false, filter: false },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false, create: false, show: false, filter: true },
    [ProjectSlug.RATES]:       { read: true, write: false, delete: false, create: false, show: false, filter: true },
    [ProjectSlug.CUSTOMERS]:   { read: true, write: false, delete: false, create: false, show: false, filter: true },
    [ProjectSlug.WEIGHMENTS]:  { read: true, write: false, delete: false, create: true,  show: true,  filter: true },
  },
}

export function getPermissions(role: Role | null | undefined, projectSlug: string): Permission {
  if (!role) {
    return { read: false, write: false, delete: false, create: false, show: false, filter: false }
  }
  return RBAC_MATRIX[role]?.[projectSlug as ProjectSlug] || { read: false, write: false, delete: false, create: false, show: false, filter: false }
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
