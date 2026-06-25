/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { getScopingFilter, applyPaginationAndSorting, type PaginatedParams } from "../scoping"

export async function fetchCentersPaginated(params: PaginatedParams): Promise<{ data: EntityRecord[]; count: number }> {
  const { search } = params
  const scope = await getScopingFilter()
  const myFactoryIds = scope?.factoryId ? [scope.factoryId] : []

  let query = supabase.from("centers").select(`
    *,
    factory:factories(id, name)
  `, { count: "exact" })

  if (scope && !scope.isSuperAdmin) {
    query = query.in("factory_id", myFactoryIds)
  }

  if (search) {
    const { data: factories } = await supabase.from("factories").select("id").ilike("name", `%${search}%`)
    const factoryIds = (factories || []).map((f: any) => f.id)
    if (factoryIds.length > 0) {
      query = query.or(`name.ilike.%${search}%,factory_id.in.(${factoryIds.join(",")})`)
    } else {
      query = query.ilike("name", `%${search}%`)
    }
  }

  query = applyPaginationAndSorting(query, params, { factory_name: "factory_id" })

  const { data, count, error } = await query
  if (error) throw new Error(error.message)

  const enrichedData = (data || []).map((item: any) => ({
    ...item,
    factory_name: item.factory?.name,
  }))

  return { data: enrichedData, count: count || 0 }
}
