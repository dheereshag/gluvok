/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { create } from "zustand"

interface EntitiesState {
  entities: Record<string, any[]>
  setEntities: (slug: string, data: any[]) => void
  updateEntity: (slug: string, primaryIdKey: string, id: string, updatedFields: Record<string, any>) => void
  deleteEntity: (slug: string, idKey: string, id: string) => void
}

export const useEntitiesStore = create<EntitiesState>((set) => ({
  entities: {},
  setEntities: (slug, data) =>
    set((state) => ({
      entities: { ...state.entities, [slug]: data },
    })),
  updateEntity: (slug, primaryIdKey, id, updatedFields) =>
    set((state) => {
      const currentList = state.entities[slug] || []
      const updatedList = currentList.map((item) =>
        String(item[primaryIdKey]) === String(id)
          ? {
              ...item,
              ...updatedFields,
              updated_at: new Date().toISOString().replace("T", " ").substring(0, 26),
            }
          : item
      )
      return {
        entities: { ...state.entities, [slug]: updatedList },
      }
    }),
  deleteEntity: (slug, idKey, id) =>
    set((state) => {
      const currentList = state.entities[slug] || []
      const updatedList = currentList.filter((item) => String(item[idKey]) !== String(id))
      return {
        entities: { ...state.entities, [slug]: updatedList },
      }
    }),
}))
