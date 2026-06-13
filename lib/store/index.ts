"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { type EntityRecord } from "@/types"
import { getField } from "./helpers"
import { PROJECT_REGISTRY } from "@/lib/projects/registry"

export * from "./helpers"
export * from "./auth"

interface EntitiesState {
  entities: Record<string, EntityRecord[]>
  hydrated: boolean
  setEntities: (slug: string, data: EntityRecord[]) => void
  addEntity: (slug: string, key: string, newE: Record<string, string | number>) => void
  updateEntity: (slug: string, key: string, id: string, fields: Record<string, string | number>) => void
  deleteEntity: (slug: string, key: string, id: string) => void
  setHydrated: (state: boolean) => void
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
          const id = newE[key] || Math.floor(Math.random() * 1000000).toString()
          newE[key] = id
          const entityToAdd = { ...newE, created_at: getTimestamp(), updated_at: getTimestamp() } as EntityRecord
          return { entities: { ...state.entities, [slug]: [entityToAdd, ...currentList] } }
        }),
      updateEntity: (slug, key, id, fields) =>
        set((state) => {
          const updatedList = (state.entities[slug] || []).map((item) =>
            String(getField(item, key)) === String(id) ? { ...item, ...fields, updated_at: getTimestamp() } as EntityRecord : item
          )
          return { entities: { ...state.entities, [slug]: updatedList } }
        }),
      deleteEntity: (slug, idKey, id) =>
        set((state) => {
          const updatedList = (state.entities[slug] || []).filter((item) => String(getField(item, idKey)) !== String(id))
          return { entities: { ...state.entities, [slug]: updatedList } }
        }),
      setHydrated: (state) => set({ hydrated: state }),
    }),
    {
      name: "gluvok-entities-storage",
      version: 3,
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
