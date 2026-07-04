/**
 * @file lib/store/preferences.ts
 * @description Zustand store for user UI preferences (column visibility, filters).
 * Persisted to localStorage — no DB round-trips needed.
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface PreferencesState {
  /** Column visibility: keyed by projectSlug → array of visible column IDs */
  columns: Record<string, string[]>
  /** Filter preferences: keyed by projectSlug → filter object */
  filters: Record<string, Record<string, unknown>>

  setColumnPreferences: (projectSlug: string, visibleColumns: string[]) => void
  setFilterPreferences: (projectSlug: string, filters: Record<string, unknown>) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      columns: {},
      filters: {},

      setColumnPreferences: (projectSlug, visibleColumns) =>
        set((state) => ({
          columns: { ...state.columns, [projectSlug]: visibleColumns },
        })),

      setFilterPreferences: (projectSlug, filters) =>
        set((state) => ({
          filters: { ...state.filters, [projectSlug]: filters },
        })),
    }),
    {
      name: "gluvok-preferences",
    }
  )
)
