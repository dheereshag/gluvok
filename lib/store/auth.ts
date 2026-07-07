/**
 * @file lib/store/auth.ts
 * @description Zustand state store or helper for managing auth data.
 */

import { create } from "zustand"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Role, EntityKey } from "@/lib/constants/enums"
import { DEFAULT_AVATAR } from "@/lib/constants"
import { type Profile, type Customer } from "@/types"
import { TABLE_NAME as PROFILES_TABLE } from "@/lib/services/profiles"
import { TABLE_NAME as CUSTOMERS_TABLE } from "@/lib/services/customers"

export const PROFILE_SELECT_FIELDS = `${EntityKey.ID}, ${EntityKey.USER_ID}, ${EntityKey.NAME}, ${EntityKey.ROLE}, ${EntityKey.AADHAR_NUMBER}, ${EntityKey.FACTORY_ID}, ${EntityKey.CREATED_AT}, ${EntityKey.UPDATED_AT}`
export const CUSTOMER_SELECT_FIELDS = `${EntityKey.ID}, ${EntityKey.NAME}, ${EntityKey.GOVT_ID}, ${EntityKey.FATHER_NAME}, ${EntityKey.FACTORY_ID}, ${EntityKey.USER_ID}, ${EntityKey.CREATED_AT}, ${EntityKey.UPDATED_AT}`

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
  /** True while a profile DB fetch is in-flight (session is known but user data not yet loaded). */
  profileLoading: boolean
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
      .from(PROFILES_TABLE)
      .select(PROFILE_SELECT_FIELDS)
      .eq(EntityKey.USER_ID, sessionUser.id)
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
      toast.error("Unable to load your profile. You may not have permission to view it. Please contact an administrator.", { id: "profile-permission-error" })
      return false
    }

    // No error but no matching profile row — genuinely unlinked account.
    if (!profile) {
      // Fallback: check if the user is a customer
      const { data: customer, error: customerError } = await supabase
        .from(CUSTOMERS_TABLE)
        .select(CUSTOMER_SELECT_FIELDS)
        .eq(EntityKey.USER_ID, sessionUser.id)
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
      toast.error("No profile linked to this account. Please contact an administrator to link your account.", { id: "no-profile-error" })
      return false
    }

    set({
      user: {
        id: sessionUser.id,
        name: profile.name,
        email: sessionUser.email || "",
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

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  hydrated: false,
  initialized: false,
  profileLoading: false,
  initAuth: () => {
    if (get().initialized) {
      return () => {}
    }

    let isInitial = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      let activeSession = session
      if (event === "INITIAL_SESSION" && !session) {
        try {
          const { data: { session: recoveredSession } } = await supabase.auth.getSession()
          if (recoveredSession) {
            activeSession = recoveredSession
          }
        } catch (err) {
          console.error("Failed to recover session during auth init:", err)
        }
      }

      if (activeSession?.user) {
        const currentUser = get().user
        const isUserChanged = !currentUser || currentUser.id !== activeSession.user.id
        const shouldFetch = isUserChanged || event === "USER_UPDATED"

        // Mark as initialized immediately once we know the session state so the
        // auth guard can unblock the UI without waiting for DB profile queries.
        if (isInitial) {
          isInitial = false
          set({ initialized: true })
        }

        if (shouldFetch) {
          set({ profileLoading: true })
          await fetchAndSetProfile(activeSession.user, set)
          set({ profileLoading: false })
        }
      } else {
        set({ user: null })

        // No session — still mark initialized so the guard can redirect to login.
        if (isInitial) {
          isInitial = false
          set({ initialized: true })
        }
      }
    })

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
    toast.success("Successfully logged out")
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
  resetPassword: async (_email, newPassword) => {
    // NOTE: supabase.auth.updateUser requires an active session.
    // This is called from /reset-password after Supabase exchanges the
    // magic-link token for a session automatically via onAuthStateChange.
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
}))
