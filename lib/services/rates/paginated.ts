/**
 * @file lib/services/rates/paginated.ts
 * @description Service for fetching paginated rates with search and filters.
 */

import {
  applyPaginationAndSorting,
  applyColumnFilters,
  applyDateRangeFilter,
  addInConditions,
  executePaginatedQuery,
  type PaginatedParams,
} from "../scoping"
import { type Rate } from "@/types"
import { buildPaginatedQuery, enrichRate } from "./query"
import { supabase } from "@/lib/supabase"
import { TABLE_NAME as COMMODITIES_TABLE } from "../commodities"
import { TABLE_NAME as FACTORIES_TABLE } from "../factories"
import { EntityKey } from "@/lib/constants/enums"

/** Sort column mapping for Rates table columns */
const RATES_SORT_MAP: Record<string, string> = {
  [EntityKey.FACTORY_NAME]: EntityKey.FACTORY_ID,
  [EntityKey.COMMODITY_NAME]: EntityKey.COMMODITY_ID,
}

export async function fetchRatesPaginated(params: PaginatedParams): Promise<{ data: Rate[]; count: number }> {
  const { search, filters } = params

  let query = buildPaginatedQuery()

  if (search) {
    const [cRes, fRes] = await Promise.all([
      supabase.from(COMMODITIES_TABLE).select(EntityKey.ID).ilike(EntityKey.NAME, `%${search}%`),
      supabase.from(FACTORIES_TABLE).select(EntityKey.ID).ilike(EntityKey.NAME, `%${search}%`),
    ])

    const orConditions: string[] = [`${EntityKey.UNIT}.ilike.%${search}%`]
    addInConditions(orConditions, [
      [EntityKey.COMMODITY_ID, cRes],
      [EntityKey.FACTORY_ID, fRes],
    ])
    query = query.or(orConditions.join(","))
  }

  // Apply general column filters and date range filters
  query = applyColumnFilters(query, filters)
  query = applyDateRangeFilter(query, filters)

  // Apply pagination and sorting
  query = applyPaginationAndSorting(query, params, RATES_SORT_MAP)

  const { data, count } = await executePaginatedQuery(query)

  return { data: data.map(enrichRate), count }
}
