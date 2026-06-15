import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { users as seedUsers } from "@/data/users"

import { Role } from "@/lib/constants"

export interface AuthUser {
  name: string
  email: string
  avatar?: string
  role: Role
}

export interface RegisteredUser {
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
  registerUser: (user: Omit<RegisteredUser, "role"> & { role?: Role }) => boolean
  resetPassword: (email: string, newPassword: string) => boolean
  setHydrated: (state: boolean) => void
}

const DEFAULT_USERS: RegisteredUser[] = seedUsers.map((u) => ({
  name: u.email.split("@")[0],
  email: u.email,
  password: "password123",
  role: u.role,
}))

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
          set({
            user: {
              name: found.name,
              email: found.email,
              avatar: "/avatars/shadcn.jpg",
              role: found.role || Role.BASE,
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
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role || Role.BASE,
        }
        const updatedUsers = [...users, userWithRole]
        set({
          registeredUsers: updatedUsers,
          user: {
            name: userWithRole.name,
            email: userWithRole.email,
            avatar: "/avatars/shadcn.jpg",
            role: userWithRole.role,
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
    }),
    {
      name: "gluvok-auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHydrated(true)
        }
      },
    }
  )
)
