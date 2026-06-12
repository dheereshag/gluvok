"use client"

import { create } from "zustand"
import { type EntityRecord } from "@/types"
import { getField } from "./helpers"

export * from "./helpers"

interface EntitiesState {
  entities: Record<string, EntityRecord[]>
  setEntities: (slug: string, data: EntityRecord[]) => void
  addEntity: (slug: string, key: string, newE: Record<string, string | number>) => void
  updateEntity: (slug: string, key: string, id: string, fields: Record<string, string | number>) => void
  deleteEntity: (slug: string, key: string, id: string) => void
}

const getTimestamp = () => new Date().toISOString().replace("T", " ").substring(0, 26)

export const useEntitiesStore = create<EntitiesState>((set) => ({
  entities: {},
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
}))
