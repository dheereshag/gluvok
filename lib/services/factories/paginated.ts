/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { getScopingFilter, applyPaginationAndSorting, type PaginatedParams } from "../scoping"

export async function fetchFactoriesPaginated(params: PaginatedParams): Promise<{ data: EntityRecord[]; count: number }> {
  const { search } = params
  const scope = await getScopingFilter()
  const myFactoryIds = scope?.factoryId ? [scope.factoryId] : []

  let query = supabase.from("factories").select(`
    *,
    village:villages(id, name)
  `, { count: "exact" })

  if (scope && !scope.isSuperAdmin) {
    query = query.in("id", myFactoryIds)
  }

  if (search) {
    const { data: villages } = await supabase.from("villages").select("id").ilike("name", `%${search}%`)
    const villageIds = (villages || []).map((v: any) => v.id)
    if (villageIds.length > 0) {
      query = query.or(`name.ilike.%${search}%,village_id.in.(${villageIds.join(",")})`)
    } else {
      query = query.ilike("name", `%${search}%`)
    }
  }

  query = applyPaginationAndSorting(query, params, { village_name: "village_id" })

  const { data, count, error } = await query
  if (error) throw new Error(error.message)

  const enrichedData = (data || []).map((item: any) => ({
    ...item,
    village_name: item.village?.name,
  }))

  return { data: enrichedData, count: count || 0 }
}
