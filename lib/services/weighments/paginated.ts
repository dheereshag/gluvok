/**
 * @file lib/services/weighments/paginated.ts
 * @description Service for fetching paginated weighments with search and filters.
 */

import {
  applyPaginationAndSorting,
  applyColumnFilters,
  applyDateRangeFilter,
  addInCondition,
  executePaginatedQuery,
  type PaginatedParams,
} from "../scoping"
import { type Weighment } from "@/types"
import { buildPaginatedQuery, enrichWeighments } from "./query"
import { supabase } from "@/lib/supabase"
import { TABLE_NAME as CENTERS_TABLE } from "../centers"
import { TABLE_NAME as PROFILES_TABLE } from "../profiles"
import { TABLE_NAME as CUSTOMERS_TABLE } from "../customers"
import { EntityKey } from "@/lib/constants/enums"

/** Sort column mapping for Weighments table columns */
const WEIGHMENTS_SORT_MAP: Record<string, string> = {
  [EntityKey.CENTER_NAME]: EntityKey.CENTER_ID,
  [EntityKey.PROFILE_NAME]: EntityKey.PROFILE_ID,
  [EntityKey.PROFILE_AADHAR]: EntityKey.PROFILE_ID,
  [EntityKey.CUSTOMER_NAME]: EntityKey.CUSTOMER_ID,
  [EntityKey.CUSTOMER_GOVT_ID]: EntityKey.CUSTOMER_ID,
  [EntityKey.COMMODITY_NAME]: EntityKey.RATE_ID,
  [EntityKey.UNIT_PRICE]: EntityKey.RATE_ID,
  [EntityKey.UNIT]: EntityKey.RATE_ID,
}

export async function fetchWeighmentsPaginated(
  params: PaginatedParams
): Promise<{ data: Weighment[]; count: number }> {
  const { search, filters } = params

  let query = buildPaginatedQuery()

  if (search) {
    const [centersRes, profilesRes, customersRes] = await Promise.all([
      supabase.from(CENTERS_TABLE).select(EntityKey.ID).ilike(EntityKey.NAME, `%${search}%`),
      supabase.from(PROFILES_TABLE).select(EntityKey.ID).ilike(EntityKey.NAME, `%${search}%`),
      supabase.from(CUSTOMERS_TABLE).select(EntityKey.ID).ilike(EntityKey.NAME, `%${search}%`),
    ])

    const orConditions: string[] = [`${EntityKey.VEHICLE_NUMBER}.ilike.%${search}%`]
    addInCondition(orConditions, EntityKey.CENTER_ID, centersRes.data)
    addInCondition(orConditions, EntityKey.PROFILE_ID, profilesRes.data)
    addInCondition(orConditions, EntityKey.CUSTOMER_ID, customersRes.data)
    query = query.or(orConditions.join(","))
  }

  // Apply general column filters and date range filters
  query = applyColumnFilters(query, filters)
  query = applyDateRangeFilter(query, filters)

  // Apply pagination and sorting
  query = applyPaginationAndSorting(query, params, WEIGHMENTS_SORT_MAP)

  const { data, count } = await executePaginatedQuery(query)

  return { data: enrichWeighments(data), count }
}
