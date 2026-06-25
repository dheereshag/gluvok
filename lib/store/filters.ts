import { Role } from "@/lib/constants/enums"
import { ProjectSlug } from "@/lib/constants/enums"
import { type EntityRecord, type Factory, type Center, type Rate, type Weighment, type Profile, type Assignment } from "@/types"
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
          const allAssignments = (allEntities[ProjectSlug.ASSIGNMENTS] || []) as Assignment[]
          const allProfiles = (allEntities[ProjectSlug.PROFILES] || []) as Profile[]
          const myProfile = allProfiles.find((p) => String(p.user_id).trim().toLowerCase() === String(user.id).trim().toLowerCase())

          let myFactoryIds: number[] = []
          switch (!!myProfile) {
            case true: {
              const profileId = myProfile!.id
              myFactoryIds = allAssignments
                .filter((a) => Number(a.profile_id) === Number(profileId))
                .map((a) => Number(a.factory_id))
              break
            }
            default:
              break
          }

          switch (projectSlug as ProjectSlug) {
            case ProjectSlug.FACTORIES:
              return rawData.filter((item) => myFactoryIds.includes(Number((item as Factory).id)))

            case ProjectSlug.CENTERS:
              return rawData.filter((item) => myFactoryIds.includes(Number((item as Center).factory_id)))

            case ProjectSlug.RATES:
              return rawData.filter((item) => myFactoryIds.includes(Number((item as Rate).factory_id)))

            case ProjectSlug.ASSIGNMENTS:
              return rawData.filter((item) => myFactoryIds.includes(Number((item as Assignment).factory_id)))

            case ProjectSlug.PROFILES: {
              const profileIdsInMyFactories = allAssignments
                .filter((a) => myFactoryIds.includes(Number(a.factory_id)))
                .map((a) => Number(a.profile_id))
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
          const allAssignments = (allEntities[ProjectSlug.ASSIGNMENTS] || []) as Assignment[]
          const allProfiles = (allEntities[ProjectSlug.PROFILES] || []) as Profile[]
          const myProfile = allProfiles.find((p) => String(p.user_id).trim().toLowerCase() === String(user.id).trim().toLowerCase())

          let myFactoryIds: number[] = []
          switch (!!myProfile) {
            case true: {
              const profileId = myProfile!.id
              myFactoryIds = allAssignments
                .filter((a) => Number(a.profile_id) === Number(profileId))
                .map((a) => Number(a.factory_id))
              break
            }
            default:
              break
          }

          switch (entitySlug as ProjectSlug) {
            case ProjectSlug.FACTORIES:
              return dataList.filter((item) => myFactoryIds.includes(Number((item as Factory).id)))

            case ProjectSlug.CENTERS:
              return dataList.filter((item) => myFactoryIds.includes(Number((item as Center).factory_id)))

            case ProjectSlug.RATES:
              return dataList.filter((item) => myFactoryIds.includes(Number((item as Rate).factory_id)))

            case ProjectSlug.PROFILES: {
              const profileIdsInMyFactories = allAssignments
                .filter((a) => myFactoryIds.includes(Number(a.factory_id)))
                .map((a) => Number(a.profile_id))
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
