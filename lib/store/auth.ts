import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface AuthUser {
  name: string
  email: string
  avatar?: string
}

export interface RegisteredUser {
  name: string
  email: string
  password?: string
}

interface AuthStore {
  user: AuthUser | null
  registeredUsers: RegisteredUser[]
  hydrated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  registerUser: (user: RegisteredUser) => boolean
  resetPassword: (email: string, newPassword: string) => boolean
  setHydrated: (state: boolean) => void
}

const DEFAULT_USERS: RegisteredUser[] = [
  {
    name: "shadcn",
    email: "m@example.com",
    password: "password123",
  },
]

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
        const updatedUsers = [...users, user]
        set({
          registeredUsers: updatedUsers,
          user: {
            name: user.name,
            email: user.email,
            avatar: "/avatars/shadcn.jpg",
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
          if (state) {
            state.setHydrated(true)
          }
        }
      },
    }
  )
)
