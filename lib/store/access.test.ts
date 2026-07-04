import { describe, it, expect } from "vitest"
import { Role, ProjectSlug } from "@/lib/constants/enums"
import { getPermissions, hasPageAccess, hasCreateAccess, hasDeleteAccess } from "./access"

describe("RBAC Access Controls", () => {
  describe("getPermissions", () => {
    it("should return default denied permissions when role is null or undefined", () => {
      const defaultDenied = { read: false, write: false, delete: false, create: false, show: false }
      expect(getPermissions(null, ProjectSlug.WEIGHMENTS)).toEqual(defaultDenied)
      expect(getPermissions(undefined, ProjectSlug.WEIGHMENTS)).toEqual(defaultDenied)
    })

    it("should grant Super Admin full access to all resources", () => {
      const allSlugs = Object.values(ProjectSlug)
      for (const slug of allSlugs) {
        const perms = getPermissions(Role.SUPER_ADMIN, slug)
        expect(perms).toEqual({
          read: true,
          write: true,
          delete: true,
          create: true,
          show: true,
        })
      }
    })

    it("should grant Admin access correct permissions (no village edits, can edit/delete but not create factories)", () => {
      const villagePerms = getPermissions(Role.ADMIN, ProjectSlug.VILLAGES)
      expect(villagePerms).toEqual({
        read: true,
        write: false,
        delete: false,
        create: false,
        show: true,
      })

      const factoryPerms = getPermissions(Role.ADMIN, ProjectSlug.FACTORIES)
      expect(factoryPerms).toEqual({
        read: true,
        write: true,
        delete: true,
        create: false,
        show: true,
      })

      const weighmentPerms = getPermissions(Role.ADMIN, ProjectSlug.WEIGHMENTS)
      expect(weighmentPerms).toEqual({
        read: true,
        write: true,
        delete: true,
        create: true,
        show: true,
      })
    })

    it("should grant Manager correct permissions (can write/create but not delete rates, customers, weighments)", () => {
      const ratePerms = getPermissions(Role.MANAGER, ProjectSlug.RATES)
      expect(ratePerms).toEqual({
        read: true,
        write: true,
        delete: false,
        create: true,
        show: true,
      })

      // Cannot see villages, factories, centers, commodities on dashboard
      expect(getPermissions(Role.MANAGER, ProjectSlug.VILLAGES).show).toBe(false)
      expect(getPermissions(Role.MANAGER, ProjectSlug.FACTORIES).show).toBe(false)
      expect(getPermissions(Role.MANAGER, ProjectSlug.CENTERS).show).toBe(false)
      expect(getPermissions(Role.MANAGER, ProjectSlug.COMMODITIES).show).toBe(false)
    })

    it("should grant Operator write/create access only to customers and weighments", () => {
      const customerPerms = getPermissions(Role.OPERATOR, ProjectSlug.CUSTOMERS)
      expect(customerPerms).toEqual({
        read: true,
        write: true,
        delete: false,
        create: true,
        show: true,
      })

      const ratePerms = getPermissions(Role.OPERATOR, ProjectSlug.RATES)
      expect(ratePerms).toEqual({
        read: true,
        write: false,
        delete: false,
        create: false,
        show: false,
      })
    })

    it("should grant Hardware role write/create/show access to weighments only", () => {
      const weighmentPerms = getPermissions(Role.HARDWARE, ProjectSlug.WEIGHMENTS)
      expect(weighmentPerms).toEqual({
        read: true,
        write: false,
        delete: false,
        create: true,
        show: true,
      })

      const customerPerms = getPermissions(Role.HARDWARE, ProjectSlug.CUSTOMERS)
      expect(customerPerms.show).toBe(false)
    })

    it("should grant Base role read only access to all but show: false to all except weighments", () => {
      const allSlugs = Object.values(ProjectSlug)
      for (const slug of allSlugs) {
        const perms = getPermissions(Role.BASE, slug)
        expect(perms).toEqual({
          read: true,
          write: false,
          delete: false,
          create: false,
          show: slug === ProjectSlug.WEIGHMENTS,
        })
      }
    })
  })

  describe("hasPageAccess", () => {
    it("should use show permission for page access", () => {
      // Operator should see weighments but not rates
      expect(hasPageAccess(Role.OPERATOR, ProjectSlug.WEIGHMENTS)).toBe(true)
      expect(hasPageAccess(Role.OPERATOR, ProjectSlug.RATES)).toBe(false)

      // Base should see weighments page on dashboard
      expect(hasPageAccess(Role.BASE, ProjectSlug.WEIGHMENTS)).toBe(true)
    })
  })

  describe("hasCreateAccess", () => {
    it("should return create permission", () => {
      expect(hasCreateAccess(Role.HARDWARE, ProjectSlug.WEIGHMENTS)).toBe(true)
      expect(hasCreateAccess(Role.HARDWARE, ProjectSlug.CUSTOMERS)).toBe(false)
    })
  })

  describe("hasDeleteAccess", () => {
    it("should return delete permission", () => {
      expect(hasDeleteAccess(Role.ADMIN, ProjectSlug.WEIGHMENTS)).toBe(true)
      expect(hasDeleteAccess(Role.MANAGER, ProjectSlug.WEIGHMENTS)).toBe(false)
    })
  })
})
