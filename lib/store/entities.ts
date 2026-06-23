"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand"
import { type EntityRecord, type Profile } from "@/types"
import { getField } from "./helpers"
import { ProjectSlug, Role } from "@/lib/constants/enums"
import { useAuthStore } from "./auth"
import { fetchAssignments, fetchAffiliations, fetchProfiles, fetchEntityList, insertRow, updateRow, deleteRow } from "@/lib/services"
import { getPermissions } from "./access"

interface EntitiesState {
  entities: Record<string, EntityRecord[]>
  hydrated: boolean
  setEntities: (slug: string, data: EntityRecord[]) => void
  addEntity: (slug: ProjectSlug, key: string, newE: Record<string, any>) => Promise<void>
  updateEntity: (slug: ProjectSlug, key: string, id: string | number, fields: Record<string, any>) => Promise<void>
  deleteEntity: (slug: ProjectSlug, key: string, id: string | number) => Promise<void>
  setHydrated: (state: boolean) => void
  resetAllEntities: () => void
  loadEntities: (slug: ProjectSlug) => Promise<void>
  updateColumnPreferences: (profileId: number, projectSlug: string, visibleColumns: string[]) => Promise<void>
  weighmentsUpdatedTrigger: number
  triggerWeighmentsUpdate: () => void
}

export const useEntitiesStore = create<EntitiesState>((set, get) => ({
  entities: {},
  hydrated: false,
  setEntities: (slug, data) => set((state) => ({ entities: { ...state.entities, [slug]: data } })),
  setHydrated: (state) => set({ hydrated: state }),
  weighmentsUpdatedTrigger: 0,
  triggerWeighmentsUpdate: () => set((state) => ({ weighmentsUpdatedTrigger: state.weighmentsUpdatedTrigger + 1 })),

  loadEntities: async (slug) => {
    try {
      const user = useAuthStore.getState().user
      const needsAccessData = user && user.role !== Role.SUPER_ADMIN

      if (needsAccessData) {
        const state = get()
        const fetches: Promise<any>[] = []
        if (!state.entities[ProjectSlug.ASSIGNMENTS]) {
          fetches.push(fetchAssignments().then(d => {
            set((s) => ({ entities: { ...s.entities, [ProjectSlug.ASSIGNMENTS]: d } }))
          }))
        }
        if (!state.entities[ProjectSlug.AFFILIATIONS]) {
          fetches.push(fetchAffiliations().then(d => {
            set((s) => ({ entities: { ...s.entities, [ProjectSlug.AFFILIATIONS]: d } }))
          }))
        }
        if (!state.entities[ProjectSlug.PROFILES]) {
          fetches.push(fetchProfiles().then(d => {
            set((s) => ({ entities: { ...s.entities, [ProjectSlug.PROFILES]: d } }))
          }))
        }
        if (fetches.length > 0) {
          await Promise.all(fetches)
        }
      }

      if (slug === ProjectSlug.WEIGHMENTS) {
        set((state) => ({
          entities: {
            ...state.entities,
            [slug]: [],
          },
        }))
        return
      }

      const data = await fetchEntityList(slug)
      set((state) => ({
        entities: {
          ...state.entities,
          [slug]: data,
        },
      }))
    } catch (error) {
      console.error(`Failed to load entities for ${slug}:`, error)
    }
  },

  addEntity: async (slug, key, newE) => {
    const enrichedRecord = await insertRow(slug, newE)

    set((state) => {
      const currentList = state.entities[slug] || []
      const nextEntities = { ...state.entities, [slug]: [enrichedRecord, ...currentList] }
      return { entities: nextEntities }
    })

    if (slug === ProjectSlug.WEIGHMENTS) {
      get().triggerWeighmentsUpdate()
    }

    // Auto-assign admin/creator to new factory
    if (slug === ProjectSlug.FACTORIES) {
      const currentUser = useAuthStore.getState().user
      if (currentUser) {
        const currentUserId = currentUser.id
        const activeProfiles = get().entities[ProjectSlug.PROFILES] as Profile[] || []
        const userProfile = activeProfiles.find(
          (p) => String(p.user_id).trim().toLowerCase() === String(currentUserId).trim().toLowerCase()
        )
        if (userProfile) {
          try {
            const newAssignment = await insertRow(ProjectSlug.ASSIGNMENTS, {
              factory_id: enrichedRecord.id,
              profile_id: userProfile.id,
            })
            set((state) => ({
              entities: {
                ...state.entities,
                [ProjectSlug.ASSIGNMENTS]: [newAssignment, ...(state.entities[ProjectSlug.ASSIGNMENTS] || [])],
              },
            }))
          } catch (err) {
            console.error("Auto-assignment for new factory failed:", err)
          }
        }
      }
    }
  },

  updateEntity: async (slug, key, id, fields) => {
    const enrichedRecord = await updateRow(slug, Number(id), fields)

    set((state) => {
      const currentList = state.entities[slug] || []
      const updatedList = currentList.map((item) =>
        String(getField(item, key)) === String(id) ? enrichedRecord : item
      )
      return { entities: { ...state.entities, [slug]: updatedList } }
    })

    if (slug === ProjectSlug.WEIGHMENTS) {
      get().triggerWeighmentsUpdate()
    }
  },

  deleteEntity: async (slug, idKey, id) => {
    await deleteRow(slug, Number(id))
    set((state) => {
      const updatedList = (state.entities[slug] || []).filter((item) => String(getField(item, idKey)) !== String(id))
      return { entities: { ...state.entities, [slug]: updatedList } }
    })

    if (slug === ProjectSlug.WEIGHMENTS) {
      get().triggerWeighmentsUpdate()
    }
  },

  resetAllEntities: () => {
    set({ entities: {} })
  },

  updateColumnPreferences: async (profileId, projectSlug, visibleColumns) => {
    const currentProfiles = (get().entities[ProjectSlug.PROFILES] || []) as Profile[]
    const targetProfile = currentProfiles.find((p) => Number(p.id) === Number(profileId))
    if (!targetProfile) return

    const currentPrefs = targetProfile.preferences || {}
    const updatedPrefs = {
      ...currentPrefs,
      [projectSlug]: visibleColumns,
    }

    const updatedProfileLocal = {
      ...targetProfile,
      preferences: updatedPrefs,
    }

    const updateLocalState = (profileData: Profile) => {
      set((state) => {
        const profiles = (state.entities[ProjectSlug.PROFILES] || []) as Profile[]
        const nextProfiles = profiles.map((p) =>
          Number(p.id) === Number(profileId) ? profileData : p
        )

        const currentUser = useAuthStore.getState().user
        if (currentUser && currentUser.profile && Number(currentUser.profile.id) === Number(profileId)) {
          useAuthStore.setState({
            user: {
              ...currentUser,
              profile: profileData,
            },
          })
        }

        return {
          entities: {
            ...state.entities,
            [ProjectSlug.PROFILES]: nextProfiles,
          },
        }
      })
    }

    const currentUser = useAuthStore.getState().user
    const canWriteProfiles = currentUser && getPermissions(currentUser.role, ProjectSlug.PROFILES).write

    if (canWriteProfiles) {
      try {
        const updatedProfile = await updateRow(ProjectSlug.PROFILES, profileId, {
          preferences: updatedPrefs,
        })
        updateLocalState(updatedProfile as Profile)
      } catch (err) {
        console.error("Failed to update column preferences in database:", err)
        updateLocalState(updatedProfileLocal as Profile)
      }
    } else {
      updateLocalState(updatedProfileLocal as Profile)
    }
  },
}))

export function resetAllEntitiesData() {
  useEntitiesStore.getState().resetAllEntities()
  useAuthStore.getState().resetAuth()
}
