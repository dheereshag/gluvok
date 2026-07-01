import { Role } from "@/lib/constants/enums"
import { ProjectSlug } from "@/lib/constants/enums"

export interface Permission {
  read: boolean
  write: boolean
  delete: boolean
  create: boolean
}

export const RBAC_MATRIX: Record<Role, Record<ProjectSlug, Permission>> = {
  [Role.SUPER_ADMIN]: {
    [ProjectSlug.PROFILES]: { read: true, write: true, delete: true, create: true },
    [ProjectSlug.VILLAGES]: { read: true, write: true, delete: true, create: true },
    [ProjectSlug.FACTORIES]: { read: true, write: true, delete: true, create: true },
    [ProjectSlug.CENTERS]: { read: true, write: true, delete: true, create: true },
    [ProjectSlug.COMMODITIES]: { read: true, write: true, delete: true, create: true },
    [ProjectSlug.RATES]: { read: true, write: true, delete: true, create: true },
    [ProjectSlug.CUSTOMERS]: { read: true, write: true, delete: true, create: true },
    [ProjectSlug.WEIGHMENTS]: { read: true, write: true, delete: true, create: true },
  },
  [Role.ADMIN]: {
    [ProjectSlug.PROFILES]: { read: true, write: true, delete: true, create: true },
    [ProjectSlug.VILLAGES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.FACTORIES]: { read: true, write: true, delete: true, create: false }, // Can edit/delete, but not create new factories
    [ProjectSlug.CENTERS]: { read: true, write: true, delete: true, create: true },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.RATES]: { read: true, write: true, delete: true, create: true },
    [ProjectSlug.CUSTOMERS]: { read: true, write: true, delete: true, create: true },
    [ProjectSlug.WEIGHMENTS]: { read: true, write: true, delete: true, create: true },
  },
  [Role.MANAGER]: {
    [ProjectSlug.PROFILES]: { read: true, write: true, delete: false, create: true },
    [ProjectSlug.VILLAGES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.FACTORIES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.CENTERS]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.RATES]: { read: true, write: true, delete: false, create: true },
    [ProjectSlug.CUSTOMERS]: { read: true, write: true, delete: false, create: true },
    [ProjectSlug.WEIGHMENTS]: { read: true, write: true, delete: false, create: true },
  },
  [Role.OPERATOR]: {
    [ProjectSlug.PROFILES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.VILLAGES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.FACTORIES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.CENTERS]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.RATES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.CUSTOMERS]: { read: true, write: true, delete: false, create: true },
    [ProjectSlug.WEIGHMENTS]: { read: true, write: true, delete: false, create: true },
  },
  [Role.BASE]: {
    [ProjectSlug.PROFILES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.VILLAGES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.FACTORIES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.CENTERS]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.RATES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.CUSTOMERS]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.WEIGHMENTS]: { read: true, write: false, delete: false, create: false },
  },
  [Role.HARDWARE]: {
    [ProjectSlug.PROFILES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.VILLAGES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.FACTORIES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.CENTERS]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.RATES]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.CUSTOMERS]: { read: true, write: false, delete: false, create: false },
    [ProjectSlug.WEIGHMENTS]: { read: true, write: false, delete: false, create: true },
  },
}

export function getPermissions(role: Role | null | undefined, projectSlug: string): Permission {
  if (!role) {
    return { read: false, write: false, delete: false, create: false }
  }
  return RBAC_MATRIX[role]?.[projectSlug as ProjectSlug] || { read: false, write: false, delete: false, create: false }
}

export function hasPageAccess(role: Role | null | undefined, projectSlug: string): boolean {
  return getPermissions(role, projectSlug).write
}

export function hasWriteAccess(role: Role | null | undefined, projectSlug: string): boolean {
  return getPermissions(role, projectSlug).write
}

export function hasCreateAccess(role: Role | null | undefined, projectSlug: string): boolean {
  return getPermissions(role, projectSlug).create
}

export function hasDeleteAccess(role: Role | null | undefined, projectSlug: string): boolean {
  return getPermissions(role, projectSlug).delete
}

