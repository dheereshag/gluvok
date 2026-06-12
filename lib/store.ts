"use client"

import { create } from "zustand"
import { type EntityRecord } from "@/types"

/** Safe dynamic field access on entity records */
export function getField(entity: EntityRecord, key: string): string | number | string[] | undefined {
  // EntityRecord is a union of typed interfaces without index signatures,
  // so we go through unknown for safe dynamic key access
  return (entity as EntityRecord & Record<string, string | number | string[] | undefined>)[key]
}



interface EntitiesState {
  entities: Record<string, EntityRecord[]>
  setEntities: (slug: string, data: EntityRecord[]) => void
  addEntity: (slug: string, primaryIdKey: string, newEntity: Record<string, string | number>) => void
  updateEntity: (slug: string, primaryIdKey: string, id: string, updatedFields: Record<string, string | number>) => void
  deleteEntity: (slug: string, idKey: string, id: string) => void
}

export const useEntitiesStore = create<EntitiesState>((set) => ({
  entities: {},
  setEntities: (slug, data) =>
    set((state) => ({
      entities: { ...state.entities, [slug]: data },
    })),
  addEntity: (slug, primaryIdKey, newEntity) =>
    set((state) => {
      const currentList = state.entities[slug] || []
      
      let id = newEntity[primaryIdKey]
      if (!id) {
        id = Math.floor(Math.random() * 1000000).toString()
        newEntity[primaryIdKey] = id
      }
      
      const entityToAdd = {
        ...newEntity,
        created_at: new Date().toISOString().replace("T", " ").substring(0, 26),
        updated_at: new Date().toISOString().replace("T", " ").substring(0, 26),
      } as EntityRecord
      return {
        entities: { ...state.entities, [slug]: [entityToAdd, ...currentList] },
      }
    }),
  updateEntity: (slug, primaryIdKey, id, updatedFields) =>
    set((state) => {
      const currentList = state.entities[slug] || []
      const updatedList = currentList.map((item) =>
        String(getField(item, primaryIdKey)) === String(id)
          ? {
              ...item,
              ...updatedFields,
              updated_at: new Date().toISOString().replace("T", " ").substring(0, 26),
            } as EntityRecord
          : item
      )
      return {
        entities: { ...state.entities, [slug]: updatedList },
      }
    }),
  deleteEntity: (slug, idKey, id) =>
    set((state) => {
      const currentList = state.entities[slug] || []
      const updatedList = currentList.filter((item) => String(getField(item, idKey)) !== String(id))
      return {
        entities: { ...state.entities, [slug]: updatedList },
      }
    }),
}))
