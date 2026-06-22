import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { users as seedUsers } from "@/data"
import { supabase } from "@/lib/supabase"

import { Role, ProjectSlug } from "@/lib/constants/enums"
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

export interface RegisteredUser {
  id: string
  name: string
  email: string
  password?: string
}

interface AuthStore {
  user: AuthUser | null
  registeredUsers: RegisteredUser[]
  hydrated: boolean
  initialized: boolean
  initAuth: () => () => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  registerUser: (user: Omit<RegisteredUser, "id">) => Promise<boolean>
  resetPassword: (email: string, newPassword: string) => Promise<boolean>
  setHydrated: (state: boolean) => void
  resetAuth: () => void
}

const DEFAULT_USERS: RegisteredUser[] = seedUsers.map((u) => ({
  id: u.id,
  name: u.email.split("@")[0],
  email: u.email,
  password: "password123",
}))

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      registeredUsers: DEFAULT_USERS,
      hydrated: false,
      initialized: false,
      initAuth: () => {
        if (get().initialized) {
          return () => {}
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            const activeProfiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] as Profile[] || []
            let profile = activeProfiles.find(
              (p) => String(p.user_id).trim().toLowerCase() === String(session.user.id).trim().toLowerCase()
            )

            if (!profile) {
              const getTimestamp = () => new Date().toISOString().replace("T", " ").substring(0, 26)
              const nextId = activeProfiles.reduce((max, p) => p.id > max ? p.id : max, 0) + 1
              profile = {
                id: nextId,
                user_id: session.user.id,
                name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
                aadhar_number: "000000000000",
                role: Role.BASE,
                preferences: {},
                created_at: getTimestamp(),
                updated_at: getTimestamp(),
              }
              useEntitiesStore.getState().setEntities(ProjectSlug.PROFILES, [profile, ...activeProfiles])
            }

            set({
              user: {
                id: session.user.id,
                name: profile.name,
                email: session.user.email || "",
                avatar: "/avatars/shadcn.jpg",
                role: profile.role,
                profile,
              }
            })
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
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          return false
        }
        return true
      },
      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null })
      },
      registerUser: async (user) => {
        if (!user.password) {
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
          return false
        }
        return true
      },
      resetPassword: async (email, newPassword) => {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        })
        if (error) {
          return false
        }
        return true
      },
      setHydrated: (state) => set({ hydrated: state }),
      resetAuth: () => {
        supabase.auth.signOut()
        set({
          user: null,
          registeredUsers: seedUsers.map((u) => ({
            id: u.id,
            name: u.email.split("@")[0],
            email: u.email,
            password: "password123",
          })),
        })
      },
    }),
    {
      name: "gluvok-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
