import { Role } from "@/lib/constants/enums"
import { ProjectSlug } from "@/lib/constants/enums"
import { type EntityRecord, type Factory, type Center, type Rate, type Profile } from "@/types"
import { type AuthUser } from "./auth"

export function filterOptionsForUser(
  entitySlug: string,
  dataList: EntityRecord[],
  currentUser: AuthUser | null
): EntityRecord[] {
  if (!currentUser) return []

  const user = currentUser

  if (user.role === Role.SUPER_ADMIN) {
    return dataList
  }

  const myProfile = user.profile
  const myFactoryId = myProfile?.factory_id

  const myFactoryIds: number[] = myFactoryId ? [Number(myFactoryId)] : []

  switch (entitySlug as ProjectSlug) {
    case ProjectSlug.FACTORIES:
      return dataList.filter((item) => myFactoryIds.includes(Number((item as Factory).id)))

    case ProjectSlug.CENTERS:
      return dataList.filter((item) => myFactoryIds.includes(Number((item as Center).factory_id)))

    case ProjectSlug.RATES:
      return dataList.filter((item) => myFactoryIds.includes(Number((item as Rate).factory_id)))

    case ProjectSlug.PROFILES: {
      if (!myFactoryId) {
        return dataList.filter((item) => {
          const profile = item as Profile
          return myProfile && Number(profile.id) === Number(myProfile.id)
        })
      }
      return dataList.filter((item) => {
        const profile = item as Profile
        if (myProfile && Number(profile.id) === Number(myProfile.id)) {
          return true
        }
        return Number(profile.factory_id) === Number(myFactoryId)
      })
    }

    case ProjectSlug.CUSTOMERS: {
      return dataList
    }

    default:
      return dataList
  }
}
