/**
 * @file lib/services/villages/paginated.ts
 * @description Database service logic for paginated fetching of villages.
 */

import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"
import { type Village } from "@/types"
import { buildPaginatedQuery } from "./query"

export async function fetchVillagesPaginated(params: PaginatedParams): Promise<{ data: Village[]; count: number }> {
  const { search } = params

  let query = buildPaginatedQuery()


  if (search) {
    query = query.or(`name.ilike.%${search}%,state.ilike.%${search}%`)
  }

  query = applyPaginationAndSorting(query, params)

  const { data, count } = await executePaginatedQuery(query)
  return { data: data as Village[], count }
}

