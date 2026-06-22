import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { users as seedUsers } from "@/data"

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
  role: Role
}

interface AuthStore {
  user: AuthUser | null
  registeredUsers: RegisteredUser[]
  hydrated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  registerUser: (user: Omit<RegisteredUser, "role" | "id"> & { role?: Role }) => boolean
  resetPassword: (email: string, newPassword: string) => boolean
  setHydrated: (state: boolean) => void
  resetAuth: () => void
}

const DEFAULT_USERS: RegisteredUser[] = seedUsers.map((u) => ({
  id: u.id,
  name: u.email.split("@")[0],
  email: u.email,
  password: "password123",
  role: u.role,
}))

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      registeredUsers: DEFAULT_USERS,
      hydrated: false,
      login: (email, password) => {
        const users = get().registeredUsers
        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        )
        if (found) {
          const activeProfiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] as Profile[] || []
          const profile = activeProfiles.find((p) => String(p.user_id).trim().toLowerCase() === String(found.id).trim().toLowerCase())
          set({
            user: {
              id: found.id,
              name: found.name,
              email: found.email,
              avatar: "/avatars/shadcn.jpg",
              role: profile?.role || found.role || Role.BASE,
              profile,
            },
          })
          return true
        }
        return false
      },
      logout: () => {
        set({ user: null })
      },
      registerUser: (user) => {
        const users = get().registeredUsers
        if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
          return false
        }
        const userWithRole: RegisteredUser = {
          id: generateUUID(),
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role || Role.BASE,
        }
        const updatedUsers = [...users, userWithRole]
        const activeProfiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] as Profile[] || []
        const profile = activeProfiles.find((p) => String(p.user_id).trim().toLowerCase() === String(userWithRole.id).trim().toLowerCase())
        set({
          registeredUsers: updatedUsers,
          user: {
            id: userWithRole.id,
            name: userWithRole.name,
            email: userWithRole.email,
            avatar: "/avatars/shadcn.jpg",
            role: profile?.role || userWithRole.role,
            profile,
          },
        })
        return true
      },
      resetPassword: (email, newPassword) => {
        const users = get().registeredUsers
        const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())
        if (index === -1) {
          return false
        }
        const updatedUsers = [...users]
        updatedUsers[index] = { ...updatedUsers[index], password: newPassword }
        set({ registeredUsers: updatedUsers })
        return true
      },
      setHydrated: (state) => set({ hydrated: state }),
      resetAuth: () => {
        set({
          user: null,
          registeredUsers: seedUsers.map((u) => ({
            id: u.id,
            name: u.email.split("@")[0],
            email: u.email,
            password: "password123",
            role: u.role,
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

