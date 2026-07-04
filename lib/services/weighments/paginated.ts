/**
 * @file lib/services/weighments/paginated.ts
 * @description Service for fetching paginated weighments with search and filters.
 */

import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"
import { type Weighment } from "@/types"
import { buildPaginatedQuery, enrichWeighments } from "./query"
import { supabase } from "@/lib/supabase"
import { TABLE_NAME as CENTERS_TABLE } from "../centers"
import { TABLE_NAME as PROFILES_TABLE } from "../profiles"
import { TABLE_NAME as CUSTOMERS_TABLE } from "../customers"
import { EntityKey } from "@/lib/constants/enums"

export async function fetchWeighmentsPaginated(params: PaginatedParams): Promise<{ data: Weighment[]; count: number }> {
  const { search, filters = {} } = params

  let query = buildPaginatedQuery()



  if (search) {
    const [centersRes, profilesRes, customersRes] = await Promise.all([
      supabase.from(CENTERS_TABLE).select(EntityKey.ID).ilike(EntityKey.NAME, `%${search}%`),
      supabase.from(PROFILES_TABLE).select(EntityKey.ID).ilike(EntityKey.NAME, `%${search}%`),
      supabase.from(CUSTOMERS_TABLE).select(EntityKey.ID).ilike(EntityKey.NAME, `%${search}%`),
    ])

    const centerIds = (centersRes.data || []).map((c: { id: number }) => c.id)
    const profileIds = (profilesRes.data || []).map((p: { id: number }) => p.id)
    const customerIds = (customersRes.data || []).map((c: { id: number }) => c.id)

    const orConditions: string[] = [`${EntityKey.VEHICLE_NUMBER}.ilike.%${search}%`]
    if (centerIds.length > 0) orConditions.push(`${EntityKey.CENTER_ID}.in.(${centerIds.join(",")})`)
    if (profileIds.length > 0) orConditions.push(`${EntityKey.PROFILE_ID}.in.(${profileIds.join(",")})`)
    if (customerIds.length > 0) orConditions.push(`${EntityKey.CUSTOMER_ID}.in.(${customerIds.join(",")})`)
    query = query.or(orConditions.join(","))
  }

  // Apply column filters — only use actual DB columns
  if (filters.rate_id)     query = query.eq(EntityKey.RATE_ID,     filters.rate_id     as number)
  if (filters.center_id)   query = query.eq(EntityKey.CENTER_ID,   filters.center_id   as number)
  if (filters.customer_id) query = query.eq(EntityKey.CUSTOMER_ID, filters.customer_id as number)
  if (filters.profile_id)  query = query.eq(EntityKey.PROFILE_ID,  filters.profile_id  as number)

  query = applyPaginationAndSorting(query, params, {
    [EntityKey.CENTER_NAME]: EntityKey.CENTER_ID,
    [EntityKey.PROFILE_NAME]: EntityKey.PROFILE_ID,
    [EntityKey.PROFILE_AADHAR]: EntityKey.PROFILE_ID,
    [EntityKey.CUSTOMER_NAME]: EntityKey.CUSTOMER_ID,
    [EntityKey.CUSTOMER_GOVT_ID]: EntityKey.CUSTOMER_ID,
    [EntityKey.COMMODITY_NAME]: EntityKey.RATE_ID,
    [EntityKey.UNIT_PRICE]: EntityKey.RATE_ID,
    [EntityKey.UNIT]: EntityKey.RATE_ID,
  })

  const { data, count } = await executePaginatedQuery(query)

  return { data: enrichWeighments(data), count }
}

