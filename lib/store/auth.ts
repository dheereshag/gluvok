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
  registerUser: (user: { name: string; email: string; password?: string }) => Promise<boolean>
  resetPassword: (email: string, newPassword: string) => Promise<boolean>
  setHydrated: (state: boolean) => void
  resetAuth: () => void
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
            try {
              const { data: profile, error } = await supabase
                .from("profiles_with_email")
                .select("*")
                .eq("user_id", session.user.id)
                .maybeSingle()

              if (error || !profile) {
                await supabase.auth.signOut()
                set({ user: null })
                useEntitiesStore.setState({ entities: {} })
                toast.error("No profile linked to this account. Please contact an administrator.")
                return
              }

              set({
                user: {
                  id: session.user.id,
                  name: profile.name,
                  email: session.user.email || profile.email || "",
                  avatar: "/avatars/profile-default.jpg",
                  role: profile.role,
                  profile: profile as Profile,
                }
              })

            } catch (err) {
              console.error("Auth state change callback error:", err)
            }
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

        try {
          const { data: profile, error: profileError } = await supabase
            .from("profiles_with_email")
            .select("*")
            .eq("user_id", data.user.id)
            .maybeSingle()

          if (profileError || !profile) {
            await supabase.auth.signOut()
            set({ user: null })
            useEntitiesStore.setState({ entities: {} })
            toast.error("No profile linked to this account. Please contact an administrator.")
            return false
          }

          set({
            user: {
              id: data.user.id,
              name: profile.name,
              email: data.user.email || profile.email || "",
              avatar: "/avatars/profile-default.jpg",
              role: profile.role,
              profile: profile as Profile,
            }
          })

          return true
        } catch (err) {
          console.error("Login profile load error:", err)
          return false
        }
      },
      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null })
        useEntitiesStore.setState({ entities: {} })
      },
      registerUser: async (user) => {
        if (!user.password) {
          toast.error("Password is required")
          return false
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
          return false
        }
        return true
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
