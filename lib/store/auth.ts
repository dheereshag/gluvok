import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Role } from "@/lib/constants/enums"
import { DEFAULT_AVATAR } from "@/lib/constants"
import { type Profile, type Customer } from "@/types"

export interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: Role
  profile?: Profile
  customer?: Customer
}

interface AuthStore {
  user: AuthUser | null
  hydrated: boolean
  initialized: boolean
  initAuth: () => () => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  registerUser: (user: { name: string; email: string; password?: string }) => Promise<{ success: boolean; requiresVerification: boolean }>
  resetPassword: (email: string, newPassword: string) => Promise<boolean>
  setHydrated: (state: boolean) => void
}

async function fetchAndSetProfile(
  sessionUser: { id: string; email?: string; user_metadata?: { name?: string } },
  set: (state: Partial<AuthStore> | ((state: AuthStore) => Partial<AuthStore>)) => void
): Promise<boolean> {
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", sessionUser.id)
      .maybeSingle()

    // Permission error (e.g. SECURITY INVOKER view + no RLS policy for this user).
    // The account exists in auth but cannot query the view — treat as unlinked.
    if (error) {
      console.warn("profiles_with_email query error:", error.message, error.code)
      set({
        user: {
          id: sessionUser.id,
          name: sessionUser.user_metadata?.name || "User",
          email: sessionUser.email || "",
          avatar: DEFAULT_AVATAR,
          role: Role.BASE,
          profile: undefined,
        }
      })
      toast.error("Unable to load your profile. You may not have permission to view it. Please contact an administrator.")
      return false
    }

    // No error but no matching profile row — genuinely unlinked account.
    if (!profile) {
      // Fallback: check if the user is a customer
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", sessionUser.id)
        .maybeSingle()
        
      if (!customerError && customer) {
        set({
          user: {
            id: sessionUser.id,
            name: customer.name,
            email: sessionUser.email || "",
            avatar: DEFAULT_AVATAR,
            role: Role.BASE,
            profile: undefined,
            customer: customer as Customer,
          }
        })
        return true
      }

      set({
        user: {
          id: sessionUser.id,
          name: sessionUser.user_metadata?.name || "User",
          email: sessionUser.email || "",
          avatar: DEFAULT_AVATAR,
          role: Role.BASE,
          profile: undefined,
        }
      })
      toast.error("No profile linked to this account. Please contact an administrator to link your account.")
      return false
    }

    set({
      user: {
        id: sessionUser.id,
        name: profile.name,
        email: sessionUser.email || profile.email || "",
        avatar: DEFAULT_AVATAR,
        role: profile.role,
        profile: profile as Profile,
      }
    })
    return true
  } catch (err) {
    console.error("Profile load error:", err)
    return false
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      hydrated: false,
      initialized: false,
      initAuth: () => {
        if (get().initialized) {
          return () => {}
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            await fetchAndSetProfile(session.user, set)
          } else {
            set({ user: null })
          }
        })

        set({ initialized: true })
        return () => {
          subscription.unsubscribe()
        }
      },
      login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error || !data.user) {
          toast.error(error?.message || "Invalid email or password.")
          return false
        }

        // We fetch and set the profile to ensure login returns true/false when completed
        await fetchAndSetProfile(data.user, set)
        // Login itself is successful (auth-wise), but we return true regardless of profile presence 
        // to let the user enter the site with the fallback role
        return true
      },
      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null })
      },
      registerUser: async (user) => {
        if (!user.password) {
          toast.error("Password is required")
          return { success: false, requiresVerification: false }
        }
        const { data, error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              name: user.name,
            }
          }
        })
        if (error || !data.user) {
          toast.error(error?.message || "Failed to register user")
          return { success: false, requiresVerification: false }
        }
        return { success: true, requiresVerification: !data.session }
      },
      resetPassword: async (email, newPassword) => {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        })
        if (error) {
          toast.error(error.message)
          return false
        }
        return true
      },
      setHydrated: (state) => set({ hydrated: state }),
    }),
    {
      name: "gluvok-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
