"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { type EntityRecord, type Profile } from "@/types"
import { getField } from "./helpers"
import { PROJECT_REGISTRY } from "@/lib/projects/registry"
import { ProjectSlug } from "@/lib/fields"
import { useAuthStore } from "./auth"

export * from "./helpers"
export * from "./auth"
export * from "./access"
export * from "./filters"

interface EntitiesState {
  entities: Record<string, EntityRecord[]>
  hydrated: boolean
  setEntities: (slug: string, data: EntityRecord[]) => void
  addEntity: (slug: string, key: string, newE: Record<string, string | number | boolean>) => void
  updateEntity: (slug: string, key: string, id: string, fields: Record<string, string | number | boolean>) => void
  deleteEntity: (slug: string, key: string, id: string) => void
  setHydrated: (state: boolean) => void
  resetAllEntities: () => void
}

const getTimestamp = () => new Date().toISOString().replace("T", " ").substring(0, 26)

const getInitialEntities = () => {
  const initialEntities: Record<string, EntityRecord[]> = {}
  Object.keys(PROJECT_REGISTRY).forEach((slug) => {
    initialEntities[slug] = PROJECT_REGISTRY[slug].data
  })
  return initialEntities
}

export const useEntitiesStore = create<EntitiesState>()(
  persist(
    (set) => ({
      entities: getInitialEntities(),
      hydrated: false,
      setEntities: (slug, data) => set((state) => ({ entities: { ...state.entities, [slug]: data } })),
      addEntity: (slug, key, newE) =>
        set((state) => {
          const currentList = state.entities[slug] || []

          let id = newE[key]
          switch (id === undefined || id === null || id === "") {
            case true: {
              const isNumericSerial = slug !== ProjectSlug.USERS
              switch (isNumericSerial) {
                case true: {
                  const maxId = currentList.reduce((max, item) => {
                    const itemId = Number(item.id || getField(item, key))
                    return itemId > max ? itemId : max
                  }, 0)
                  id = maxId + 1
                  break
                }
                default:
                  id = Math.floor(Math.random() * 1000000).toString()
                  break
              }
              break
            }
            default:
              break
          }
          newE[key] = id
          const entityToAdd = { ...newE, created_at: getTimestamp(), updated_at: getTimestamp() } as EntityRecord

          const nextEntities = { ...state.entities, [slug]: [entityToAdd, ...currentList] }

          // Auto-assign admin/creator to new factory
          switch (slug as ProjectSlug) {
            case ProjectSlug.FACTORIES: {
              const currentUser = useAuthStore.getState().user
              switch (!!currentUser) {
                case true: {
                  const currentUserId = currentUser!.id
                  const activeProfiles = state.entities[ProjectSlug.PROFILES] as Profile[] || []
                  const userProfile = activeProfiles.find((p) => String(p.user_id).trim().toLowerCase() === String(currentUserId).trim().toLowerCase())
                  switch (!!userProfile) {
                    case true: {
                      const currentAssignments = state.entities[ProjectSlug.ASSIGNMENTS] || []
                      const newAssignment = {
                        id: currentAssignments.length + 1,
                        factory_id: Number(id),
                        profile_id: Number(userProfile!.id),
                        created_at: getTimestamp(),
                        updated_at: getTimestamp()
                      } as EntityRecord
                      nextEntities[ProjectSlug.ASSIGNMENTS] = [newAssignment, ...currentAssignments]
                      break
                    }
                    default:
                      break
                  }
                  break
                }
                default:
                  break
              }
              break
            }
            default:
              break
          }

          return { entities: nextEntities }
        }),
      updateEntity: (slug, key, id, fields) =>
        set((state) => {
          switch (slug as ProjectSlug) {
            case ProjectSlug.RATES:
              throw new Error("Rates are not editable or deletable")
            default:
              break
          }

          const currentList = state.entities[slug] || []

          const updatedList = currentList.map((item) =>
            String(getField(item, key)) === String(id) ? { ...item, ...fields, updated_at: getTimestamp() } as EntityRecord : item
          )

          return { entities: { ...state.entities, [slug]: updatedList } }
        }),
      deleteEntity: (slug, idKey, id) =>
        set((state) => {
          switch (slug as ProjectSlug) {
            case ProjectSlug.RATES:
              throw new Error("Rates are not editable or deletable")
            default:
              break
          }
          const updatedList = (state.entities[slug] || []).filter((item) => String(getField(item, idKey)) !== String(id))
          return { entities: { ...state.entities, [slug]: updatedList } }
        }),
      setHydrated: (state) => set({ hydrated: state }),
      resetAllEntities: () =>
        set(() => {
          const initialEntities: Record<string, EntityRecord[]> = {}
          Object.keys(PROJECT_REGISTRY).forEach((slug) => {
            initialEntities[slug] = PROJECT_REGISTRY[slug].data
          })
          return { entities: initialEntities }
        }),
    }),
    {
      name: "gluvok-entities-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export function resetAllEntitiesData() {
  useEntitiesStore.getState().resetAllEntities()
  useAuthStore.getState().resetAuth()
}
