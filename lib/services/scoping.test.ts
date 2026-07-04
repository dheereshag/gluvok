import { describe, it, expect, vi, beforeEach } from "vitest"
import { useAuthStore } from "@/lib/store/auth"
import { Role } from "@/lib/constants/enums"
import {
  getScopingFilter,
  applyPaginationAndSorting,
  executeListQuery,
  executeSingleQuery,
  executePaginatedQuery,
  type AnyQuery,
} from "./scoping"


type ScopedAuthStoreState = ReturnType<typeof useAuthStore.getState>

// Mock useAuthStore
vi.mock("@/lib/store/auth", () => {
  const mockStore = {
    getState: vi.fn(),
  }
  return {
    useAuthStore: mockStore,
  }
})

describe("Query Scoping Services", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getScopingFilter", () => {
    it("should return null if there is no logged in user", async () => {
      vi.mocked(useAuthStore.getState).mockReturnValue({
        user: null,
        hydrated: false,
        initialized: false,
        initAuth: () => () => {},
        login: async () => true,
        logout: async () => {},
        registerUser: async () => ({ success: true, requiresVerification: false }),
        resetPassword: async () => true,
        setHydrated: () => {},
      } as unknown as ScopedAuthStoreState)

      const filter = await getScopingFilter()
      expect(filter).toBeNull()
    })

    it("should return superadmin flag and correct scoping fields for logged in user", async () => {
      vi.mocked(useAuthStore.getState).mockReturnValue({
        user: {
          role: Role.MANAGER,
          profile: { factory_id: 12, id: 34, user_id: "u1", aadhar_number: "a1", name: "n1", created_at: "", updated_at: "" },
          customer: { id: 56, govt_id: 1, name: "c1", father_name: "f1", village_id: 1, factory_id: 1, created_at: "", updated_at: "" },
          id: "u1",
          name: "n1",
          email: "e1",
        },
        hydrated: true,
        initialized: true,
        initAuth: () => () => {},
        login: async () => true,
        logout: async () => {},
        registerUser: async () => ({ success: true, requiresVerification: false }),
        resetPassword: async () => true,
        setHydrated: () => {},
      } as unknown as ScopedAuthStoreState)

      const filter = await getScopingFilter()
      expect(filter).toEqual({
        isSuperAdmin: false,
        factoryId: 12,
        userProfileId: 34,
        customerId: 56,
      })
    })

    it("should handle superadmin role properly", async () => {
      vi.mocked(useAuthStore.getState).mockReturnValue({
        user: {
          role: Role.SUPER_ADMIN,
          id: "u2",
          name: "n2",
          email: "e2",
        },
        hydrated: true,
        initialized: true,
        initAuth: () => () => {},
        login: async () => true,
        logout: async () => {},
        registerUser: async () => ({ success: true, requiresVerification: false }),
        resetPassword: async () => true,
        setHydrated: () => {},
      } as unknown as ScopedAuthStoreState)

      const filter = await getScopingFilter()
      expect(filter?.isSuperAdmin).toBe(true)
      expect(filter?.factoryId).toBeUndefined()
    })
  })

  describe("applyPaginationAndSorting", () => {
    it("should apply correct range and order to query builder", () => {
      const mockQuery = {
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockReturnThis(),
      }

      const params = {
        page: 2,
        pageSize: 15,
        sortColumn: "name",
        sortDesc: true,
      }

      applyPaginationAndSorting(
        mockQuery as unknown as AnyQuery<Record<string, unknown>>,
        params,
        {},
        "created_at"
      )

      // Page 2, PageSize 15 => from = 30, to = 44
      expect(mockQuery.range).toHaveBeenCalledWith(30, 44)
      // sortDesc is true => ascending is false (since it does !sortDesc)
      expect(mockQuery.order).toHaveBeenCalledWith("name", { ascending: false })
    })

    it("should use default sort column and descending order when no sorting specified", () => {
      const mockQuery = {
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockReturnThis(),
      }

      const params = {
        page: 0,
        pageSize: 10,
      }

      applyPaginationAndSorting(
        mockQuery as unknown as AnyQuery<Record<string, unknown>>,
        params,
        {},
        "updated_at"
      )

      expect(mockQuery.range).toHaveBeenCalledWith(0, 9)
      expect(mockQuery.order).toHaveBeenCalledWith("updated_at", { ascending: false })
    })

    it("should use mapped sort column if provided in sortMap", () => {
      const mockQuery = {
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockReturnThis(),
      }

      const params = {
        page: 0,
        pageSize: 10,
        sortColumn: "factory_name",
        sortDesc: false,
      }

      const sortMap = { factory_name: "factory_id" }
      applyPaginationAndSorting(
        mockQuery as unknown as AnyQuery<Record<string, unknown>>,
        params,
        sortMap,
        "updated_at"
      )

      expect(mockQuery.order).toHaveBeenCalledWith("factory_id", { ascending: true })
    })
  })

  describe("executeListQuery", () => {
    it("should apply ordering and return list", async () => {
      const mockResult = [{ id: 1 }, { id: 2 }]
      const mockQuery = {
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation((onfulfilled) => {
          return Promise.resolve(onfulfilled({ data: mockResult, error: null }))
        }),
      }

      const result = await executeListQuery(
        mockQuery as unknown as AnyQuery<Record<string, unknown>>,
        "name"
      )

      expect(mockQuery.order).toHaveBeenCalledWith("name", { ascending: false })
      expect(result).toEqual(mockResult)
    })

    it("should throw error if list query fails", async () => {
      const mockQuery = {
        order: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation((onfulfilled) => {
          return Promise.resolve(onfulfilled({ data: null, error: { message: "List Error" } }))
        }),
      }

      await expect(
        executeListQuery(mockQuery as unknown as AnyQuery<Record<string, unknown>>)
      ).rejects.toThrow("List Error")
    })
  })

  describe("executeSingleQuery", () => {
    it("should filter by ID, call maybeSingle and return record", async () => {
      const mockResult = { id: 42, name: "Test" }
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation((onfulfilled) => {
          return Promise.resolve(onfulfilled({ data: mockResult, error: null }))
        }),
      }

      const result = await executeSingleQuery(
        mockQuery as unknown as AnyQuery<Record<string, unknown>>,
        42
      )

      expect(mockQuery.eq).toHaveBeenCalledWith("id", 42)
      expect(mockQuery.maybeSingle).toHaveBeenCalled()
      expect(result).toEqual(mockResult)
    })

    it("should throw if record not found", async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation((onfulfilled) => {
          return Promise.resolve(onfulfilled({ data: null, error: null }))
        }),
      }

      await expect(
        executeSingleQuery(mockQuery as unknown as AnyQuery<Record<string, unknown>>, 42)
      ).rejects.toThrow("Record with ID 42 not found")
    })

    it("should throw error if single query fails", async () => {
      const mockQuery = {
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockReturnThis(),
        then: vi.fn().mockImplementation((onfulfilled) => {
          return Promise.resolve(onfulfilled({ data: null, error: { message: "Single Error" } }))
        }),
      }

      await expect(
        executeSingleQuery(mockQuery as unknown as AnyQuery<Record<string, unknown>>, 42)
      ).rejects.toThrow("Single Error")
    })
  })


  describe("executePaginatedQuery", () => {
    it("should return data and count from execution", async () => {
      const mockQuery = {
        then: vi.fn().mockImplementation((onfulfilled) => {
          return Promise.resolve(onfulfilled({ data: [{ id: 1 }], count: 5, error: null }))
        }),
      }

      const result = await executePaginatedQuery(
        mockQuery as unknown as AnyQuery<Record<string, unknown>>
      )
      expect(result).toEqual({ data: [{ id: 1 }], count: 5 })
    })

    it("should throw error if paginated query fails", async () => {
      const mockQuery = {
        then: vi.fn().mockImplementation((onfulfilled) => {
          return Promise.resolve(onfulfilled({ data: null, count: 0, error: { message: "Paginated Fail" } }))
        }),
      }

      await expect(
        executePaginatedQuery(mockQuery as unknown as AnyQuery<Record<string, unknown>>)
      ).rejects.toThrow("Paginated Fail")
    })
  })
})
