import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { applyPaginationAndSorting, executePaginatedQuery, getScopingFilter, type PaginatedParams } from "../scoping"

export async function fetchCustomersPaginated(params: PaginatedParams): Promise<{ data: EntityRecord[]; count: number }> {
  const { search } = params
  const scope = await getScopingFilter()
  const myFactoryIds = scope?.factoryId ? [scope.factoryId] : []

  let query = supabase.from("customers").select(`
    *,
    village:villages(id, name)
  `, { count: "exact" })

  if (scope && !scope.isSuperAdmin) {
    query = query.in("factory_id", myFactoryIds)
  }

  if (search) {
    const { data: villages } = await supabase.from("villages").select("id").ilike("name", `%${search}%`)
    const villageIds = (villages || []).map((v: { id: number }) => v.id)
    if (villageIds.length > 0) {
      query = query.or(`name.ilike.%${search}%,father_name.ilike.%${search}%,village_id.in.(${villageIds.join(",")})`)
    } else {
      query = query.or(`name.ilike.%${search}%,father_name.ilike.%${search}%`)
    }
  }

  query = applyPaginationAndSorting(query, params, { village_name: "village_id" })

  const { data, count } = await executePaginatedQuery(query)

  const userIds = data.map((item) => item.user_id).filter(Boolean)
  let profiles: { user_id: string; email: string }[] = []
  if (userIds.length > 0) {
    const { data: profileData } = await supabase
      .from("profiles_with_email")
      .select("user_id, email")
      .in("user_id", userIds)
    profiles = (profileData || []) as { user_id: string; email: string }[]
  }

  const enrichedData = data.map((item) => {
    const profile = item.user_id ? profiles.find((p) => p.user_id === item.user_id) : null
    return {
      ...item,
      village_name: item.village?.name,
      user_email: profile?.email || item.user_id || undefined,
    }
  })

  return { data: enrichedData, count }
}
