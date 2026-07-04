"use client"

import { create } from "zustand"
import { type Commodity } from "@/types"
import { ProjectSlug } from "@/lib/constants/enums"
import { insertRow, updateRow, deleteRow, fetchCommodities } from "@/lib/services"

interface EntitiesState {
  addEntity: (slug: ProjectSlug, key: string, newE: Record<string, unknown>) => Promise<void>
  updateEntity: (slug: ProjectSlug, key: string, id: string | number, fields: Record<string, unknown>) => Promise<void>
  deleteEntity: (slug: ProjectSlug, key: string, id: string | number) => Promise<void>
  entitiesUpdatedTrigger: number
  triggerEntitiesUpdate: () => void
  commodities: Commodity[]
  loadCommodities: () => Promise<void>
  filtersLoading: Record<string, boolean>
  setFiltersLoading: (slug: string, loading: boolean) => void
}

export const useEntitiesStore = create<EntitiesState>((set, get) => ({
  entitiesUpdatedTrigger: 0,
  triggerEntitiesUpdate: () => set((state) => ({ entitiesUpdatedTrigger: state.entitiesUpdatedTrigger + 1 })),
  filtersLoading: {},
  setFiltersLoading: (slug, loading) => set((state) => ({
    filtersLoading: { ...state.filtersLoading, [slug]: loading }
  })),
  commodities: [],
  loadCommodities: async () => {
    if (get().commodities.length > 0) return
    try {
      const list = await fetchCommodities()
      set({ commodities: list as Commodity[] })
    } catch (err) {
      console.error("Failed to fetch commodities for store:", err)
    }
  },

  addEntity: async (slug, key, newE) => {
    await insertRow(slug, newE)
    get().triggerEntitiesUpdate()
  },

  updateEntity: async (slug, key, id, fields) => {
    await updateRow(slug, Number(id), fields)
    get().triggerEntitiesUpdate()
  },

  deleteEntity: async (slug, idKey, id) => {
    await deleteRow(slug, Number(id))
    get().triggerEntitiesUpdate()
  },
}))
