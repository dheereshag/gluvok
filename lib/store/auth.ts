import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Role } from "@/lib/constants/enums"
import { type Profile } from "@/types"
import { useEntitiesStore } from "./entities"

export interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: Role
  profile?: Profile
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
  resetAuth: () => void
}

async function fetchAndSetProfile(
  sessionUser: { id: string; email?: string; user_metadata?: { name?: string } },
  set: (state: Partial<AuthStore> | ((state: AuthStore) => Partial<AuthStore>)) => void
): Promise<boolean> {
  try {
    const { data: profile, error } = await supabase
      .from("profiles_with_email")
      .select("*")
      .eq("user_id", sessionUser.id)
      .maybeSingle()

    if (error || !profile) {
      set({
        user: {
          id: sessionUser.id,
          name: sessionUser.user_metadata?.name || "User",
          email: sessionUser.email || "",
          avatar: "/avatars/profile-default.jpg",
          role: Role.BASE,
          profile: undefined,
        }
      })
      toast.error("No profile linked to this account. Some features may be disabled. Please contact an administrator.")
      return false
    }

    set({
      user: {
        id: sessionUser.id,
        name: profile.name,
        email: sessionUser.email || profile.email || "",
        avatar: "/avatars/profile-default.jpg",
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
            useEntitiesStore.setState({ entities: {} })
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
        useEntitiesStore.setState({ entities: {} })
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
      resetAuth: () => {
        supabase.auth.signOut()
        set({ user: null })
        useEntitiesStore.setState({ entities: {} })
      },
    }),
    {
      name: "gluvok-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
