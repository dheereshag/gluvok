import { ProjectSlug, EntityKey } from "@/lib/constants/enums"
import { useEntitiesStore, getField } from "@/lib/store"
import { type EntityRecord } from "@/types"

export interface UniquenessError {
  field: string
  message: string
}

/**
 * Checks if updating an entity violates any uniqueness constraints.
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
    case ProjectSlug.PROFILES: {
      // 1. Check aadhar_number uniqueness
      const currentAadhar = String(getField(item, EntityKey.AADHAR_NUMBER) ?? "")
      const newAadhar = String(values[EntityKey.AADHAR_NUMBER] ?? "")

      if (newAadhar && newAadhar !== currentAadhar) {
        const list = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] || []
        const exists = list.some((e) => {
          if (String(getField(e, EntityKey.AADHAR_NUMBER)) === String(getField(item, EntityKey.AADHAR_NUMBER))) {
            return false
          }
          return String(getField(e, EntityKey.AADHAR_NUMBER)) === newAadhar
        })
        if (exists) {
          return {
            field: EntityKey.AADHAR_NUMBER,
            message: "A profile with this Aadhar number already exists",
          }
        }
      }

      // 2. Check user ID uniqueness
      const currentUserId = String(getField(item, EntityKey.ID) ?? "")
      const newUserId = String(values[EntityKey.ID] ?? "")

      if (newUserId && newUserId !== currentUserId) {
        const list = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] || []
        const exists = list.some((e) => {
          if (String(getField(e, EntityKey.AADHAR_NUMBER)) === String(getField(item, EntityKey.AADHAR_NUMBER))) {
            return false
          }
          return String(getField(e, EntityKey.ID)) === newUserId
        })

        if (exists) {
          return {
            field: EntityKey.ID,
            message: "A profile already exists for this user",
          }
        }
      }
      break
    }
    case ProjectSlug.CUSTOMERS: {
      // 1. Check govt_id uniqueness
      const currentGovtId = String(getField(item, EntityKey.GOVT_ID) ?? "")
      const newGovtId = String(values[EntityKey.GOVT_ID] ?? "")

      if (newGovtId && newGovtId !== currentGovtId) {
        const list = useEntitiesStore.getState().entities[ProjectSlug.CUSTOMERS] || []
        const exists = list.some((e) => {
          if (String(getField(e, EntityKey.GOVT_ID)) === String(getField(item, EntityKey.GOVT_ID))) {
            return false
          }
          return String(getField(e, EntityKey.GOVT_ID)) === newGovtId
        })
        if (exists) {
          return {
            field: EntityKey.GOVT_ID,
            message: "A customer with this Govt ID already exists",
          }
        }
      }

      // 2. Check user ID uniqueness
      const currentUserId = String(getField(item, EntityKey.ID) ?? "")
      const newUserId = String(values[EntityKey.ID] ?? "")

      if (newUserId && newUserId !== currentUserId) {
        const list = useEntitiesStore.getState().entities[ProjectSlug.CUSTOMERS] || []
        const exists = list.some((e) => {
          if (String(getField(e, EntityKey.GOVT_ID)) === String(getField(item, EntityKey.GOVT_ID))) {
            return false
          }
          const uId = getField(e, EntityKey.ID)
          return uId && String(uId) === newUserId
        })

        if (exists) {
          return {
            field: EntityKey.ID,
            message: "A customer already exists for this user",
          }
        }
      }
      break
    }
    case ProjectSlug.USERS: {
      const currentEmail = String(getField(item, EntityKey.EMAIL) ?? "").trim().toLowerCase()
      const newEmail = String(values[EntityKey.EMAIL] ?? "").trim().toLowerCase()

      if (newEmail !== currentEmail) {
        const list = useEntitiesStore.getState().entities[ProjectSlug.USERS] || []
        const exists = list.some((e) => {
          if (String(getField(e, EntityKey.ID)) === String(getField(item, EntityKey.ID))) {
            return false
          }
          const email = String(getField(e, EntityKey.EMAIL) ?? "").trim().toLowerCase()
          return email === newEmail
        })

        if (exists) {
          return {
            field: EntityKey.EMAIL,
            message: "A user with this email already exists",
          }
        }
      }
      break
    }
    default:
      break
  }

  return null
}
