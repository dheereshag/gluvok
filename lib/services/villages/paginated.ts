/**
 * @file lib/services/villages/paginated.ts
 * @description Database service logic for paginated fetching of villages.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"

export async function fetchVillagesPaginated(params: PaginatedParams): Promise<{ data: EntityRecord[]; count: number }> {
  const { search } = params

  let query = supabase.from("villages").select("*", { count: "exact" })

  if (search) {
    query = query.or(`name.ilike.%${search}%,state.ilike.%${search}%`)
  }

  query = applyPaginationAndSorting(query, params)

  return executePaginatedQuery(query)
}
