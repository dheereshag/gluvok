/**
 * @file lib/services/factories/paginated.ts
 * @description Database service logic for paginated fetching of factories.
 */

import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"
import { type Factory } from "@/types"
import { buildPaginatedQuery, enrichFactory } from "./query"
import { EntityKey } from "@/lib/constants/enums"

export async function fetchFactoriesPaginated(params: PaginatedParams): Promise<{ data: Factory[]; count: number }> {
  const { search } = params

  let query = buildPaginatedQuery()

  if (search) {
    query = query.ilike(EntityKey.NAME, `%${search}%`)
  }

  query = applyPaginationAndSorting(query, params, {})

  const { data, count } = await executePaginatedQuery(query)

  return { data: data.map(enrichFactory), count }
}

