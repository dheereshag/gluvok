import { Role } from "@/lib/constants/enums"
import { ProjectSlug } from "@/lib/constants/enums"
import { type EntityRecord, type Factory, type Center, type Rate, type Weighment, type Profile } from "@/types"
import { type AuthUser } from "./auth"

export function filterEntitiesForUser(
  projectSlug: string,
  rawData: EntityRecord[],
  currentUser: AuthUser | null,
  allEntities: Record<string, EntityRecord[]>
): EntityRecord[] {
  switch (!!currentUser) {
    case false:
      return []
    default: {
      const user = currentUser!
      switch (user.role) {
        case Role.SUPER_ADMIN:
          return rawData
        default: {
          // Scope by factory assignments for all other roles (ADMIN, MANAGER, OPERATOR, BASE)
          const allProfiles = (allEntities[ProjectSlug.PROFILES] || []) as Profile[]
          const myProfile = allProfiles.find((p) => String(p.user_id).trim().toLowerCase() === String(user.id).trim().toLowerCase())

          let myFactoryIds: number[] = []
          if (myProfile && myProfile.factory_id) {
            myFactoryIds = [Number(myProfile.factory_id)]
          }

          switch (projectSlug as ProjectSlug) {
            case ProjectSlug.FACTORIES:
              return rawData.filter((item) => myFactoryIds.includes(Number((item as Factory).id)))

            case ProjectSlug.CENTERS:
              return rawData.filter((item) => myFactoryIds.includes(Number((item as Center).factory_id)))

            case ProjectSlug.RATES:
              return rawData.filter((item) => myFactoryIds.includes(Number((item as Rate).factory_id)))

            case ProjectSlug.PROFILES: {
              const profileIdsInMyFactories = allProfiles
                .filter((p) => myFactoryIds.includes(Number(p.factory_id)))
                .map((p) => Number(p.id))
                .filter(Boolean)
              return rawData.filter((item) => {
                const profile = item as Profile
                if (myProfile && Number(profile.id) === Number(myProfile.id)) {
                  return true
                }
                return profileIdsInMyFactories.includes(Number(profile.id))
              })
            }

            case ProjectSlug.CUSTOMERS: {
              return rawData
            }

            case ProjectSlug.WEIGHMENTS: {
              const allCenters = (allEntities[ProjectSlug.CENTERS] || []) as Center[]
              const centerIdsInMyFactories = allCenters
                .filter((c) => myFactoryIds.includes(Number(c.factory_id)))
                .map((c) => c.id)
              return rawData.filter((item) => centerIdsInMyFactories.includes(Number((item as Weighment).center_id)))
            }

            default:
              return rawData
          }
        }
      }
    }
  }
}

export function filterOptionsForUser(
  entitySlug: string,
  dataList: EntityRecord[],
  currentUser: AuthUser | null,
  allEntities: Record<string, EntityRecord[]>
): EntityRecord[] {
  switch (!!currentUser) {
    case false:
      return []
    default: {
      const user = currentUser!

      switch (user.role) {
        case Role.SUPER_ADMIN:
          return dataList
        default: {
          const allProfiles = (allEntities[ProjectSlug.PROFILES] || []) as Profile[]
          const myProfile = allProfiles.find((p) => String(p.user_id).trim().toLowerCase() === String(user.id).trim().toLowerCase())

          let myFactoryIds: number[] = []
          if (myProfile && myProfile.factory_id) {
            myFactoryIds = [Number(myProfile.factory_id)]
          }

          switch (entitySlug as ProjectSlug) {
            case ProjectSlug.FACTORIES:
              return dataList.filter((item) => myFactoryIds.includes(Number((item as Factory).id)))

            case ProjectSlug.CENTERS:
              return dataList.filter((item) => myFactoryIds.includes(Number((item as Center).factory_id)))

            case ProjectSlug.RATES:
              return dataList.filter((item) => myFactoryIds.includes(Number((item as Rate).factory_id)))

            case ProjectSlug.PROFILES: {
              const profileIdsInMyFactories = allProfiles
                .filter((p) => myFactoryIds.includes(Number(p.factory_id)))
                .map((p) => Number(p.id))
                .filter(Boolean)
              return dataList.filter((item) => {
                const profile = item as Profile
                if (myProfile && Number(profile.id) === Number(myProfile.id)) {
                  return true
                }
                return profileIdsInMyFactories.includes(Number(profile.id))
              })
            }

            case ProjectSlug.CUSTOMERS: {
              return dataList
            }

            default:
              return dataList
          }
        }
      }
    }
  }
}
