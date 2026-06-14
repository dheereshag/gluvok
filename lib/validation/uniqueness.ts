import { ProjectSlug, EntityKey } from "@/lib/fields"
import { useEntitiesStore, getField } from "@/lib/store"
import { type EntityRecord } from "@/types"

export interface UniquenessError {
  field: string
  message: string
}

/**
 * Checks if updating an entity violates any uniqueness constraints.
 * This helper uses a switch case based on the projectSlug to validate fields,
 * and is designed to be easily replaced or integrated with database-level constraints (like Supabase) later.
 */
export function checkEditUniqueness(
  projectSlug: ProjectSlug,
  item: EntityRecord,
  values: Record<string, unknown>
): UniquenessError | null {
  switch (projectSlug) {
    case ProjectSlug.COMMODITIES: {
      const currentName = String(getField(item, EntityKey.NAME) ?? "")
      const newName = String(values[EntityKey.NAME] ?? "")

      if (newName.trim().toLowerCase() !== currentName.trim().toLowerCase()) {
        const list = useEntitiesStore.getState().entities[ProjectSlug.COMMODITIES] || []
        const exists = list.some((e) => {
          const n = getField(e, EntityKey.NAME)
          return typeof n === "string" && n.trim().toLowerCase() === newName.trim().toLowerCase()
        })

        if (exists) {
          return {
            field: EntityKey.NAME,
            message: `A ${projectSlug} with this ${EntityKey.NAME} already exists`,
          }
        }
      }
      break
    }
    case ProjectSlug.CENTERS: {
      const currentName = String(getField(item, EntityKey.NAME) ?? "")
      const currentFactoryId = String(getField(item, EntityKey.FACTORY_ID) ?? "")

      const newName = String(values[EntityKey.NAME] ?? "")
      const newFactoryId = String(values[EntityKey.FACTORY_ID] ?? "")

      if (
        newName.trim().toLowerCase() !== currentName.trim().toLowerCase() ||
        newFactoryId !== currentFactoryId
      ) {
        const list = useEntitiesStore.getState().entities[ProjectSlug.CENTERS] || []
        const exists = list.some((e) => {
          // exclude the current center being edited using its ID
          if (String(getField(e, EntityKey.ID)) === String(getField(item, EntityKey.ID))) {
            return false
          }
          const n = getField(e, EntityKey.NAME)
          const f = getField(e, EntityKey.FACTORY_ID)
          return (
            typeof n === "string" &&
            n.trim().toLowerCase() === newName.trim().toLowerCase() &&
            String(f) === newFactoryId
          )
        })

        if (exists) {
          return {
            field: EntityKey.NAME,
            message: "A center with this name and factory ID already exists",
          }
        }
      }
      break
    }
    // Future uniqueness checks can be added as case blocks here
    default:
      break
  }

  return null
}
