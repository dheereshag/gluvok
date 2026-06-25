"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand"
import { type Profile } from "@/types"
import { ProjectSlug } from "@/lib/constants/enums"
import { useAuthStore } from "./auth"
import { insertRow, updateRow, deleteRow } from "@/lib/services"
import { getPermissions } from "./access"

interface EntitiesState {
  addEntity: (slug: ProjectSlug, key: string, newE: Record<string, any>) => Promise<void>
  updateEntity: (slug: ProjectSlug, key: string, id: string | number, fields: Record<string, any>) => Promise<void>
  deleteEntity: (slug: ProjectSlug, key: string, id: string | number) => Promise<void>
  updateColumnPreferences: (profileId: number, projectSlug: string, visibleColumns: string[]) => Promise<void>
  entitiesUpdatedTrigger: number
  triggerEntitiesUpdate: () => void
}

export const useEntitiesStore = create<EntitiesState>((set, get) => ({
  entitiesUpdatedTrigger: 0,
  triggerEntitiesUpdate: () => set((state) => ({ entitiesUpdatedTrigger: state.entitiesUpdatedTrigger + 1 })),

  addEntity: async (slug, key, newE) => {
    const enrichedRecord = await insertRow(slug, newE)

    get().triggerEntitiesUpdate()

    // Auto-assign admin/creator to new factory
    if (slug === ProjectSlug.FACTORIES) {
      const currentUser = useAuthStore.getState().user
      if (currentUser && currentUser.profile && !currentUser.profile.factory_id) {
        try {
          await get().updateEntity(ProjectSlug.PROFILES, "id", currentUser.profile.id, {
            factory_id: enrichedRecord.id,
          })
          
          // Sync profile factory_id locally in auth store
          useAuthStore.setState({
            user: {
              ...currentUser,
              profile: {
                ...currentUser.profile,
                factory_id: enrichedRecord.id,
              }
            }
          })
        } catch (err) {
          console.error("Auto-assignment for new factory failed:", err)
        }
      }
    }
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
}))

export function resetAllEntitiesData() {
  useAuthStore.getState().resetAuth()
}
