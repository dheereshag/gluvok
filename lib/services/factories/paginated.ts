import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"

export async function fetchFactoriesPaginated(params: PaginatedParams): Promise<{ data: EntityRecord[]; count: number }> {
  const { search } = params

  let query = supabase.from("factories").select(`
    *,
    village:villages(id, name)
  `, { count: "exact" })

  if (search) {
    const { data: villages } = await supabase.from("villages").select("id").ilike("name", `%${search}%`)
    const villageIds = (villages || []).map((v: { id: number }) => v.id)
    if (villageIds.length > 0) {
      query = query.or(`name.ilike.%${search}%,village_id.in.(${villageIds.join(",")})`)
    } else {
      query = query.ilike("name", `%${search}%`)
    }
  }

  query = applyPaginationAndSorting(query, params, { village_name: "village_id" })

  const { data, count } = await executePaginatedQuery(query)

  const enrichedData = data.map((item) => ({
    ...item,
    village_name: item.village?.name,
  }))

  return { data: enrichedData, count }
}
