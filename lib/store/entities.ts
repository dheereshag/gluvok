/**
 * @file lib/store/entities.ts
 * @description Zustand state store or helper for managing entities data.
 */

"use client"

import { create } from "zustand"
import { type Commodity } from "@/types"
import { ProjectSlug, EntityKey } from "@/lib/constants/enums"
import { insertRow, updateRow, deleteRow, fetchCommodities } from "@/lib/services"
import { supabase } from "@/lib/supabase"

export const CENTERS_SELECT_FIELDS = `${EntityKey.ID}, ${EntityKey.NAME}`
export const PROFILES_SELECT_FIELDS = `${EntityKey.ID}, ${EntityKey.NAME}`
export const CUSTOMERS_SELECT_FIELDS = `${EntityKey.ID}, ${EntityKey.NAME}`
export const RATES_SELECT_FIELDS = `${EntityKey.ID}, ${EntityKey.UNIT_PRICE}, ${EntityKey.UNIT}, commodity:${ProjectSlug.COMMODITIES}(${EntityKey.NAME})`

export interface IdNamePair { id: number; name: string }
export interface RateOption { id: number; label: string }

interface EntitiesState {
  addEntity: (slug: ProjectSlug, key: string, newE: Record<string, unknown>) => Promise<void>
  updateEntity: (slug: ProjectSlug, key: string, id: string | number, fields: Record<string, unknown>) => Promise<void>
  deleteEntity: (slug: ProjectSlug, key: string, id: string | number) => Promise<void>
  entitiesUpdatedTrigger: number
  triggerEntitiesUpdate: () => void
  commodities: Commodity[]
  loadCommodities: () => Promise<void>
  factories: IdNamePair[]
  loadFactories: () => Promise<void>
  weighmentFiltersData: {
    centers: IdNamePair[]
    profiles: IdNamePair[]
    customers: IdNamePair[]
    rates: RateOption[]
  } | null
  loadWeighmentFiltersData: () => Promise<void>
  filtersLoading: Record<string, boolean>
  setFiltersLoading: (slug: string, loading: boolean) => void
}

export const useEntitiesStore = create<EntitiesState>((set, get) => ({
  entitiesUpdatedTrigger: 0,
  triggerEntitiesUpdate: () => set((state) => ({ entitiesUpdatedTrigger: state.entitiesUpdatedTrigger + 1 })),
  filtersLoading: {
    [ProjectSlug.WEIGHMENTS]: true,
    [ProjectSlug.RATES]: true,
    [ProjectSlug.CUSTOMERS]: true,
    [ProjectSlug.CENTERS]: true,
    [ProjectSlug.FACTORIES]: true,
  },
  setFiltersLoading: (slug, loading) => set((state) => ({
    filtersLoading: { ...state.filtersLoading, [slug]: loading }
  })),
  commodities: [],
  loadCommodities: async () => {
    set((state) => ({
      filtersLoading: { ...state.filtersLoading, [ProjectSlug.RATES]: true }
    }))
    if (get().commodities.length > 0) {
      set((state) => ({
        filtersLoading: { ...state.filtersLoading, [ProjectSlug.RATES]: false }
      }))
      return
    }
    try {
      const list = await fetchCommodities()
      set((state) => ({
        commodities: list as Commodity[],
        filtersLoading: { ...state.filtersLoading, [ProjectSlug.RATES]: false }
      }))
    } catch (err) {
      console.error("Failed to fetch commodities for store:", err)
      set((state) => ({
        filtersLoading: { ...state.filtersLoading, [ProjectSlug.RATES]: false }
      }))
    }
  },

  factories: [],
  loadFactories: async () => {
    set((state) => ({
      filtersLoading: { ...state.filtersLoading, [ProjectSlug.CENTERS]: true }
    }))
    if (get().factories.length > 0) {
      set((state) => ({
        filtersLoading: { ...state.filtersLoading, [ProjectSlug.CENTERS]: false }
      }))
      return
    }
    try {
      const { data, error } = await supabase.from(ProjectSlug.FACTORIES).select("id, name").order("name")
      if (error) throw error
      set((state) => ({
        factories: (data as IdNamePair[]) || [],
        filtersLoading: { ...state.filtersLoading, [ProjectSlug.CENTERS]: false }
      }))
    } catch (err) {
      console.error("Failed to fetch factories for store:", err)
      set((state) => ({
        filtersLoading: { ...state.filtersLoading, [ProjectSlug.CENTERS]: false }
      }))
    }
  },
  weighmentFiltersData: null,
  loadWeighmentFiltersData: async () => {
    set((state) => ({
      filtersLoading: { ...state.filtersLoading, [ProjectSlug.WEIGHMENTS]: true }
    }))
    if (get().weighmentFiltersData !== null) {
      set((state) => ({
        filtersLoading: { ...state.filtersLoading, [ProjectSlug.WEIGHMENTS]: false }
      }))
      return
    }
    try {
      const [c, p, cu, r] = await Promise.all([
        supabase.from(ProjectSlug.CENTERS).select(CENTERS_SELECT_FIELDS).order("name"),
        supabase.from(ProjectSlug.PROFILES).select(PROFILES_SELECT_FIELDS).order("name"),
        supabase.from(ProjectSlug.CUSTOMERS).select(CUSTOMERS_SELECT_FIELDS).order("name"),
        supabase.from(ProjectSlug.RATES).select(RATES_SELECT_FIELDS).order("id"),
      ])

      const centers = (c.data as IdNamePair[]) || []
      const profiles = (p.data as IdNamePair[]) || []
      const customers = (cu.data as IdNamePair[]) || []
      const rateOpts = ((r.data || []) as unknown as Array<{ id: number; unit_price: number; unit: string; commodity: { name: string } | null }>).map((rate) => ({
        id: rate.id,
        label: `${rate.commodity?.name ?? "—"} · ₹${rate.unit_price}/${rate.unit} (ID: ${rate.id})`,
      }))

      set((state) => ({
        weighmentFiltersData: { centers, profiles, customers, rates: rateOpts },
        filtersLoading: { ...state.filtersLoading, [ProjectSlug.WEIGHMENTS]: false }
      }))
    } catch (err) {
      console.error("Failed to fetch weighment filters for store:", err)
      set((state) => ({
        filtersLoading: { ...state.filtersLoading, [ProjectSlug.WEIGHMENTS]: false }
      }))
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

