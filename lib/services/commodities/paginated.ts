/**
 * @file lib/services/commodities/paginated.ts
 * @description Database service logic for paginated fetching of commodities.
 */

import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"
import { type Commodity } from "@/types"
import { buildPaginatedQuery } from "./query"

import { EntityKey } from "@/lib/constants/enums"

export async function fetchCommoditiesPaginated(params: PaginatedParams): Promise<{ data: Commodity[]; count: number }> {
  const { search } = params

  let query = buildPaginatedQuery()



  if (search) {
    query = query.ilike(EntityKey.NAME, `%${search}%`)
  }

  query = applyPaginationAndSorting(query, params)

  const { data, count } = await executePaginatedQuery(query)
  return { data: data as Commodity[], count }
}

