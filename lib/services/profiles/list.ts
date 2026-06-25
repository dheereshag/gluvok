import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { getScopingFilter, executeAndOrderList } from "../scoping"

export async function fetchProfiles(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("profiles_with_email").select(`
    *,
    factory:factories(name)
  `)

  if (id === undefined) {
    const scope = await getScopingFilter()
    if (scope && !scope.isSuperAdmin) {
      const userProfileId = scope.userProfileId
      const factoryId = scope.factoryId
      if (factoryId) {
        query = query.or(`factory_id.eq.${factoryId},id.eq.${userProfileId}`)
      } else if (userProfileId) {
        query = query.eq("id", userProfileId)
      } else {
        return []
      }
    }
  }

  const data = await executeAndOrderList(query, id)

  return data.map((item) => {
    return {
      ...item,
      factory_name: item.factory?.name || "",
    }
  })
}
