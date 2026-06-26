import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"

export async function fetchCommoditiesPaginated(params: PaginatedParams): Promise<{ data: EntityRecord[]; count: number }> {
  const { search } = params

  let query = supabase.from("commodities").select("*", { count: "exact" })

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  query = applyPaginationAndSorting(query, params)

  return executePaginatedQuery(query)
}
