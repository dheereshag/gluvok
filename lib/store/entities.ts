"use client"

import { create } from "zustand"
import { type Profile } from "@/types"
import { ProjectSlug } from "@/lib/constants/enums"
import { useAuthStore } from "./auth"
import { insertRow, updateRow, deleteRow } from "@/lib/services"
import { getPermissions } from "./access"

interface EntitiesState {
  addEntity: (slug: ProjectSlug, key: string, newE: Record<string, unknown>) => Promise<void>
  updateEntity: (slug: ProjectSlug, key: string, id: string | number, fields: Record<string, unknown>) => Promise<void>
  deleteEntity: (slug: ProjectSlug, key: string, id: string | number) => Promise<void>
  updateColumnPreferences: (profileId: number, projectSlug: string, visibleColumns: string[]) => Promise<void>
  updateFilterPreferences: (profileId: number, projectSlug: string, filters: Record<string, unknown>) => Promise<void>
  entitiesUpdatedTrigger: number
  triggerEntitiesUpdate: () => void
}

export const useEntitiesStore = create<EntitiesState>((set, get) => ({
  entitiesUpdatedTrigger: 0,
  triggerEntitiesUpdate: () => set((state) => ({ entitiesUpdatedTrigger: state.entitiesUpdatedTrigger + 1 })),

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

  updateColumnPreferences: async (profileId, projectSlug, visibleColumns) => {
    const currentUser = useAuthStore.getState().user
    const targetProfile = currentUser?.profile
    if (!targetProfile || Number(targetProfile.id) !== Number(profileId)) return

    const currentPrefs = targetProfile.preferences || {}
    const updatedPrefs = {
      ...currentPrefs,
      [projectSlug]: visibleColumns,
    }

    const updatedProfile = {
      ...targetProfile,
      preferences: updatedPrefs,
    }

    const updateLocalState = (profileData: Profile) => {
      useAuthStore.setState({
        user: {
          ...currentUser!,
          profile: profileData,
        },
      })
    }

    const canWriteProfiles = currentUser && getPermissions(currentUser.role, ProjectSlug.PROFILES).write

    if (canWriteProfiles) {
      try {
        const result = await updateRow(ProjectSlug.PROFILES, profileId, {
          preferences: updatedPrefs,
        })
        updateLocalState(result as Profile)
      } catch (err) {
        console.error("Failed to update column preferences in database:", err)
        updateLocalState(updatedProfile as Profile)
      }
    } else {
      updateLocalState(updatedProfile as Profile)
    }
  },

  updateFilterPreferences: async (profileId, projectSlug, filters) => {
    const currentUser = useAuthStore.getState().user
    const targetProfile = currentUser?.profile
    if (!targetProfile || Number(targetProfile.id) !== Number(profileId)) return

    const currentPrefs = targetProfile.preferences || {}
    const updatedPrefs = {
      ...currentPrefs,
      [`${projectSlug}_filters`]: filters,
    }

    const updatedProfile = {
      ...targetProfile,
      preferences: updatedPrefs,
    }

    const updateLocalState = (profileData: Profile) => {
      useAuthStore.setState({
        user: {
          ...currentUser!,
          profile: profileData,
        },
      })
    }

    const canWriteProfiles = currentUser && getPermissions(currentUser.role, ProjectSlug.PROFILES).write

    if (canWriteProfiles) {
      try {
        const result = await updateRow(ProjectSlug.PROFILES, profileId, {
          preferences: updatedPrefs,
        })
        updateLocalState(result as Profile)
      } catch (err) {
        console.error("Failed to update filter preferences in database:", err)
        updateLocalState(updatedProfile as Profile)
      }
    } else {
      updateLocalState(updatedProfile as Profile)
    }
  },
}))

