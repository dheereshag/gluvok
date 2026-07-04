/**
 * @file lib/services/rates/paginated.ts
 * @description Service for fetching paginated rates with search and filters.
 */

import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"
import { type Rate } from "@/types"
import { buildPaginatedQuery, enrichRate } from "./query"
import { supabase } from "@/lib/supabase"
import { TABLE_NAME as COMMODITIES_TABLE } from "../commodities"
import { TABLE_NAME as FACTORIES_TABLE } from "../factories"
import { EntityKey } from "@/lib/constants/enums"

export async function fetchRatesPaginated(params: PaginatedParams): Promise<{ data: Rate[]; count: number }> {
  const { search } = params

  let query = buildPaginatedQuery()

  if (search) {
    const [cRes, fRes] = await Promise.all([
      supabase.from(COMMODITIES_TABLE).select(EntityKey.ID).ilike(EntityKey.NAME, `%${search}%`),
      supabase.from(FACTORIES_TABLE).select(EntityKey.ID).ilike(EntityKey.NAME, `%${search}%`),
    ])
    const cIds = (cRes.data || []).map((c: { id: number }) => c.id)
    const fIds = (fRes.data || []).map((f: { id: number }) => f.id)

    const orConditions: string[] = [`${EntityKey.UNIT}.ilike.%${search}%`]
    if (cIds.length > 0) orConditions.push(`${EntityKey.COMMODITY_ID}.in.(${cIds.join(",")})`)
    if (fIds.length > 0) orConditions.push(`${EntityKey.FACTORY_ID}.in.(${fIds.join(",")})`)
    query = query.or(orConditions.join(","))
  }

  if (params.filters) {
    Object.entries(params.filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        query = query.eq(key, val)
      }
    })
  }

  query = applyPaginationAndSorting(query, params, {
    [EntityKey.FACTORY_NAME]: EntityKey.FACTORY_ID,
    [EntityKey.COMMODITY_NAME]: EntityKey.COMMODITY_ID,
  })

  const { data, count } = await executePaginatedQuery(query)

  return { data: data.map(enrichRate), count }
}

