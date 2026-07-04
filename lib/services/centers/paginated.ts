/**
 * @file lib/services/centers/paginated.ts
 * @description Database service logic for paginated fetching of centers.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"

export async function fetchCentersPaginated(params: PaginatedParams): Promise<{ data: EntityRecord[]; count: number }> {
  const { search } = params

  let query = supabase.from("centers").select(`
    *,
    factory:factories(id, name)
  `, { count: "exact" })
  if (search) {
    const { data: factories } = await supabase.from("factories").select("id").ilike("name", `%${search}%`)
    const factoryIds = (factories || []).map((f: { id: number }) => f.id)
    if (factoryIds.length > 0) {
      query = query.or(`name.ilike.%${search}%,factory_id.in.(${factoryIds.join(",")})`)
    } else {
      query = query.ilike("name", `%${search}%`)
    }
  }

  query = applyPaginationAndSorting(query, params, { factory_name: "factory_id" })

  const { data, count } = await executePaginatedQuery(query)

  const enrichedData = data.map((item) => ({
    ...item,
    factory_name: item.factory?.name,
  }))

  return { data: enrichedData, count }
}
