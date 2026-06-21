import { Role } from "@/lib/constants/enums"
import { ProjectSlug } from "@/lib/constants/enums"

export interface Permission {
  read: boolean
  write: boolean
  delete: boolean
}

export const RBAC_MATRIX: Record<Role, Record<ProjectSlug, Permission>> = {
  [Role.SUPER_ADMIN]: {
    [ProjectSlug.USERS]: { read: true, write: true, delete: true },
    [ProjectSlug.PROFILES]: { read: true, write: true, delete: true },
    [ProjectSlug.VILLAGES]: { read: true, write: true, delete: true },
    [ProjectSlug.FACTORIES]: { read: true, write: true, delete: true },
    [ProjectSlug.CENTERS]: { read: true, write: true, delete: true },
    [ProjectSlug.COMMODITIES]: { read: true, write: true, delete: true },
    [ProjectSlug.RATES]: { read: true, write: true, delete: true },
    [ProjectSlug.CUSTOMERS]: { read: true, write: true, delete: true },
    [ProjectSlug.WEIGHMENTS]: { read: true, write: true, delete: true },
    [ProjectSlug.ASSIGNMENTS]: { read: true, write: true, delete: true },
  },
  [Role.ADMIN]: {
    [ProjectSlug.USERS]: { read: false, write: false, delete: false },
    [ProjectSlug.PROFILES]: { read: true, write: true, delete: true },
    [ProjectSlug.VILLAGES]: { read: true, write: false, delete: false },
    [ProjectSlug.FACTORIES]: { read: true, write: true, delete: true },
    [ProjectSlug.CENTERS]: { read: true, write: true, delete: true },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false },
    [ProjectSlug.RATES]: { read: true, write: true, delete: true },
    [ProjectSlug.CUSTOMERS]: { read: true, write: true, delete: true },
    [ProjectSlug.WEIGHMENTS]: { read: true, write: true, delete: true },
    [ProjectSlug.ASSIGNMENTS]: { read: true, write: true, delete: true },
  },
  [Role.MANAGER]: {
    [ProjectSlug.USERS]: { read: false, write: false, delete: false },
    [ProjectSlug.PROFILES]: { read: true, write: true, delete: false },
    [ProjectSlug.VILLAGES]: { read: true, write: false, delete: false },
    [ProjectSlug.FACTORIES]: { read: true, write: false, delete: false },
    [ProjectSlug.CENTERS]: { read: true, write: false, delete: false },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false },
    [ProjectSlug.RATES]: { read: true, write: true, delete: false },
    [ProjectSlug.CUSTOMERS]: { read: true, write: true, delete: false },
    [ProjectSlug.WEIGHMENTS]: { read: true, write: true, delete: false },
    [ProjectSlug.ASSIGNMENTS]: { read: true, write: false, delete: false },
  },
  [Role.OPERATOR]: {
    [ProjectSlug.USERS]: { read: false, write: false, delete: false },
    [ProjectSlug.PROFILES]: { read: false, write: false, delete: false },
    [ProjectSlug.VILLAGES]: { read: true, write: false, delete: false },
    [ProjectSlug.FACTORIES]: { read: true, write: false, delete: false },
    [ProjectSlug.CENTERS]: { read: true, write: false, delete: false },
    [ProjectSlug.COMMODITIES]: { read: true, write: false, delete: false },
    [ProjectSlug.RATES]: { read: true, write: false, delete: false },
    [ProjectSlug.CUSTOMERS]: { read: true, write: true, delete: false },
    [ProjectSlug.WEIGHMENTS]: { read: true, write: true, delete: false },
    [ProjectSlug.ASSIGNMENTS]: { read: false, write: false, delete: false },
  },
  [Role.BASE]: {
    [ProjectSlug.USERS]: { read: false, write: false, delete: false },
    [ProjectSlug.PROFILES]: { read: false, write: false, delete: false },
    [ProjectSlug.VILLAGES]: { read: false, write: false, delete: false },
    [ProjectSlug.FACTORIES]: { read: false, write: false, delete: false },
    [ProjectSlug.CENTERS]: { read: false, write: false, delete: false },
    [ProjectSlug.COMMODITIES]: { read: false, write: false, delete: false },
    [ProjectSlug.RATES]: { read: false, write: false, delete: false },
    [ProjectSlug.CUSTOMERS]: { read: false, write: false, delete: false },
    [ProjectSlug.WEIGHMENTS]: { read: true, write: false, delete: false },
    [ProjectSlug.ASSIGNMENTS]: { read: false, write: false, delete: false },
  },
}

export function getPermissions(role: Role | null | undefined, projectSlug: string): Permission {
  if (!role) {
    return { read: false, write: false, delete: false }
  }
  return RBAC_MATRIX[role]?.[projectSlug as ProjectSlug] || { read: false, write: false, delete: false }
}

export function hasPageAccess(role: Role | null | undefined, projectSlug: string): boolean {
  return getPermissions(role, projectSlug).read
}

export function hasWriteAccess(role: Role | null | undefined, projectSlug: string): boolean {
  return getPermissions(role, projectSlug).write
}

export function hasDeleteAccess(role: Role | null | undefined, projectSlug: string): boolean {
  return getPermissions(role, projectSlug).delete
}
