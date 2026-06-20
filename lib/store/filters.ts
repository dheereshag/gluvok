import { Role } from "@/lib/constants"
import { ProjectSlug } from "@/lib/fields"
import { type EntityRecord, type Factory, type Center, type Rate, type Weighment, type Profile, type Assignment, type User } from "@/types"
import { type AuthUser } from "./auth"

export function filterEntitiesForUser(
  projectSlug: string,
  rawData: EntityRecord[],
  currentUser: AuthUser | null,
  allEntities: Record<string, EntityRecord[]>
): EntityRecord[] {
  if (!currentUser) return []

  // SUPER_ADMIN has access to everything
  if (currentUser.role === Role.SUPER_ADMIN) {
    return rawData
  }

  // ADMIN scoping
  if (currentUser.role === Role.ADMIN) {
    const allAssignments = (allEntities[ProjectSlug.ASSIGNMENTS] || []) as Assignment[]
    const myFactoryIds = allAssignments
      .filter((a) => String(a.user_id) === String(currentUser.id))
      .map((a) => Number(a.factory_id))

    switch (projectSlug as ProjectSlug) {
      case ProjectSlug.FACTORIES:
        return rawData.filter((item) => myFactoryIds.includes(Number((item as Factory).id)))

      case ProjectSlug.CENTERS:
        return rawData.filter((item) => myFactoryIds.includes(Number((item as Center).factory_id)))

      case ProjectSlug.RATES:
        return rawData.filter((item) => myFactoryIds.includes(Number((item as Rate).factory_id)))

      case ProjectSlug.ASSIGNMENTS:
        return rawData.filter((item) => myFactoryIds.includes(Number((item as Assignment).factory_id)))

      case ProjectSlug.PROFILES:
        const userIdsInMyFactories = allAssignments
          .filter((a) => myFactoryIds.includes(Number(a.factory_id)))
          .map((a) => String(a.user_id))
        return rawData.filter((item) => userIdsInMyFactories.includes(String((item as Profile).id)))

      case ProjectSlug.WEIGHMENTS:
        const allCenters = (allEntities[ProjectSlug.CENTERS] || []) as Center[]
        const centerIdsInMyFactories = allCenters
          .filter((c) => myFactoryIds.includes(Number(c.factory_id)))
          .map((c) => c.id)
        return rawData.filter((item) => centerIdsInMyFactories.includes(Number((item as Weighment).center_id)))

      default:
        // Other entities (villages, commodities, customers, users) are not scoped by factory for ADMIN
        return rawData
    }
  }

  // For other roles, just return rawData
  return rawData
}

export function filterOptionsForUser(
  entitySlug: string,
  dataList: EntityRecord[],
  currentUser: AuthUser | null,
  allEntities: Record<string, EntityRecord[]>,
  contextSlug?: string,
  fieldKey?: string
): EntityRecord[] {
  if (!currentUser) return []

  // When creating/editing assignments, restrict users dropdown to ADMIN, MANAGER, OPERATOR
  if (entitySlug === ProjectSlug.USERS && contextSlug === ProjectSlug.ASSIGNMENTS && fieldKey === "user_id") {
    const users = dataList as User[]
    return users.filter((u) => u.role === Role.ADMIN || u.role === Role.MANAGER || u.role === Role.OPERATOR)
  }

  // SUPER_ADMIN has access to everything
  if (currentUser.role === Role.SUPER_ADMIN) {
    return dataList
  }

  // ADMIN scoping for dropdown select choices
  if (currentUser.role === Role.ADMIN) {
    const allAssignments = (allEntities[ProjectSlug.ASSIGNMENTS] || []) as Assignment[]
    const myFactoryIds = allAssignments
      .filter((a) => String(a.user_id) === String(currentUser.id))
      .map((a) => Number(a.factory_id))

    switch (entitySlug as ProjectSlug) {
      case ProjectSlug.FACTORIES:
        return dataList.filter((item) => myFactoryIds.includes(Number((item as Factory).id)))

      case ProjectSlug.CENTERS:
        return dataList.filter((item) => myFactoryIds.includes(Number((item as Center).factory_id)))

      case ProjectSlug.RATES:
        return dataList.filter((item) => myFactoryIds.includes(Number((item as Rate).factory_id)))

      case ProjectSlug.PROFILES:
        const userIdsInMyFactories = allAssignments
          .filter((a) => myFactoryIds.includes(Number(a.factory_id)))
          .map((a) => String(a.user_id))
        return dataList.filter((item) => userIdsInMyFactories.includes(String((item as Profile).id)))

      default:
        return dataList
    }
  }

  return dataList
}
