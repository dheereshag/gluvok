import { describe, it, expect, vi, beforeEach } from "vitest"
import { useAuthStore } from "./auth"
import { supabase } from "@/lib/supabase"
import { Role } from "@/lib/constants/enums"
import { toast } from "sonner"

// Mock supabase client
vi.mock("@/lib/supabase", () => {
  const mockFrom = vi.fn()
  const mockAuth = {
    onAuthStateChange: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    signUp: vi.fn(),
    updateUser: vi.fn(),
  }
  return {
    supabase: {
      from: mockFrom,
      auth: mockAuth,
    },
  }
})

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

type MockFunc = ReturnType<typeof vi.fn>

describe("Auth Store (Zustand)", () => {
  let mockSelect: MockFunc
  let mockEq: MockFunc
  let mockMaybeSingle: MockFunc
  let authCallback: (event: string, session: unknown) => Promise<unknown>

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup typical supabase builder chains
    mockMaybeSingle = vi.fn()
    mockEq = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle })
    mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
    vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as unknown as ReturnType<typeof supabase.from>)

    // Reset store state
    useAuthStore.setState({
      user: null,
      hydrated: false,
      initialized: false,
    })

    // Setup default mock subscription
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation(((cb: (event: string, session: unknown) => Promise<unknown>) => {
      authCallback = cb
      cb("INITIAL_SESSION", null)
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    }) as unknown as typeof supabase.auth.onAuthStateChange)
  })

  describe("initAuth", () => {
    it("should set initialized flag and register auth state listener", () => {
      const unsubscribe = useAuthStore.getState().initAuth()
      expect(useAuthStore.getState().initialized).toBe(true)
      expect(supabase.auth.onAuthStateChange).toHaveBeenCalled()
      expect(unsubscribe).toBeDefined()
    })

    it("should do nothing if already initialized", () => {
      useAuthStore.setState({ initialized: true })
      const unsubscribe = useAuthStore.getState().initAuth()
      expect(supabase.auth.onAuthStateChange).not.toHaveBeenCalled()
      unsubscribe() // should not crash
    })

    it("should fetch profile when auth state changes to signed-in user", async () => {
      const mockProfile = {
        id: 1,
        name: "Test User",
        role: Role.ADMIN,
        email: "test@gluvok.com",
      }
      mockMaybeSingle.mockResolvedValue({ data: mockProfile, error: null })

      useAuthStore.getState().initAuth()

      // Trigger auth state change callback
      const mockSession = { user: { id: "user-123", email: "test@gluvok.com" } }
      await authCallback("SIGNED_IN", mockSession)

      expect(supabase.from).toHaveBeenCalledWith("profiles")
      expect(mockEq).toHaveBeenCalledWith("user_id", "user-123")
      expect(useAuthStore.getState().user).toEqual({
        id: "user-123",
        name: "Test User",
        email: "test@gluvok.com",
        avatar: "/avatars/profile-default.jpg",
        role: Role.ADMIN,
        profile: mockProfile,
      })
    })

    it("should clear user when auth state changes to null session", async () => {
      useAuthStore.setState({ user: { id: "1", name: "1", email: "1", role: Role.BASE } })
      useAuthStore.getState().initAuth()

      await authCallback("SIGNED_OUT", null)
      expect(useAuthStore.getState().user).toBeNull()
    })

    it("should load customer profile if no standard profile is linked", async () => {
      // 1. profiles query returns null (no profile)
      mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null })
      // 2. customers query returns customer record
      const mockCustomer = { id: 7, name: "Customer Bob" }
      mockMaybeSingle.mockResolvedValueOnce({ data: mockCustomer, error: null })

      useAuthStore.getState().initAuth()

      const mockSession = { user: { id: "user-789", email: "bob@customer.com" } }
      await authCallback("SIGNED_IN", mockSession)

      expect(useAuthStore.getState().user).toEqual({
        id: "user-789",
        name: "Customer Bob",
        email: "bob@customer.com",
        avatar: "/avatars/profile-default.jpg",
        role: Role.BASE,
        profile: undefined,
        customer: mockCustomer,
      })
    })

    it("should set fallback BASE profile and show toast if loading profile fails with permission error", async () => {
      mockMaybeSingle.mockResolvedValueOnce({ data: null, error: { message: "Permission Denied", code: "PGRST116" } })

      useAuthStore.getState().initAuth()

      const mockSession = { user: { id: "user-123", email: "test@gluvok.com", user_metadata: { name: "Test" } } }
      await authCallback("SIGNED_IN", mockSession)

      expect(useAuthStore.getState().user).toEqual({
        id: "user-123",
        name: "Test",
        email: "test@gluvok.com",
        avatar: "/avatars/profile-default.jpg",
        role: Role.BASE,
        profile: undefined,
      })
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Unable to load your profile")
      )
    })
  })

  describe("login", () => {
    it("should sign in via Supabase and load profile on success", async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: { id: "user-456", email: "admin@gluvok.com" } },
        error: null,
      } as unknown as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>)

      const mockProfile = { id: 2, name: "Admin User", role: Role.SUPER_ADMIN }
      mockMaybeSingle.mockResolvedValue({ data: mockProfile, error: null })

      const success = await useAuthStore.getState().login("admin@gluvok.com", "password")

      expect(success).toBe(true)
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "admin@gluvok.com",
        password: "password",
      })
      expect(useAuthStore.getState().user?.role).toBe(Role.SUPER_ADMIN)
    })

    it("should return false and toast error on Supabase sign in failure", async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null },
        error: { message: "Invalid credentials" },
      } as unknown as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>)

      const success = await useAuthStore.getState().login("admin@gluvok.com", "password")

      expect(success).toBe(false)
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials")
      expect(useAuthStore.getState().user).toBeNull()
    })
  })

  describe("logout", () => {
    it("should sign out via Supabase and clear user state", async () => {
      useAuthStore.setState({ user: { id: "user-123", name: "1", email: "1", role: Role.BASE } })
      await useAuthStore.getState().logout()

      expect(supabase.auth.signOut).toHaveBeenCalled()
      expect(useAuthStore.getState().user).toBeNull()
    })
  })

  describe("registerUser", () => {
    it("should return error if password is not provided", async () => {
      const res = await useAuthStore.getState().registerUser({ name: "User", email: "user@test.com" })
      expect(res).toEqual({ success: false, requiresVerification: false })
      expect(toast.error).toHaveBeenCalledWith("Password is required")
    })

    it("should sign up via Supabase with user metadata", async () => {
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: { id: "new-user" }, session: {} },
        error: null,
      } as unknown as Awaited<ReturnType<typeof supabase.auth.signUp>>)

      const res = await useAuthStore.getState().registerUser({
        name: "Jane Doe",
        email: "jane@test.com",
        password: "password123",
      })

      expect(res).toEqual({ success: true, requiresVerification: false })
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "jane@test.com",
        password: "password123",
        options: {
          data: { name: "Jane Doe" },
        },
      })
    })
  })

  describe("resetPassword", () => {
    it("should update password via Supabase", async () => {
      vi.mocked(supabase.auth.updateUser).mockResolvedValue({ data: {}, error: null } as unknown as Awaited<ReturnType<typeof supabase.auth.updateUser>>)

      const success = await useAuthStore.getState().resetPassword("email@test.com", "newPass")

      expect(success).toBe(true)
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: "newPass" })
    })

    it("should toast error and return false if password update fails", async () => {
      vi.mocked(supabase.auth.updateUser).mockResolvedValue({ data: {}, error: { message: "Weak password" } } as unknown as Awaited<ReturnType<typeof supabase.auth.updateUser>>)

      const success = await useAuthStore.getState().resetPassword("email@test.com", "123")

      expect(success).toBe(false)
      expect(toast.error).toHaveBeenCalledWith("Weak password")
    })
  })
})
