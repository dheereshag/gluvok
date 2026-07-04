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

export async function fetchWeighmentsPaginated(params: PaginatedParams): Promise<{ data: Weighment[]; count: number }> {
  const { search, filters = {} } = params

  let query = buildPaginatedQuery()



  if (search) {
    const [centersRes, profilesRes, customersRes] = await Promise.all([
      supabase.from(CENTERS_TABLE).select("id").ilike("name", `%${search}%`),
      supabase.from(PROFILES_TABLE).select("id").ilike("name", `%${search}%`),
      supabase.from(CUSTOMERS_TABLE).select("id").ilike("name", `%${search}%`),
    ])

    const centerIds = (centersRes.data || []).map((c: { id: number }) => c.id)
    const profileIds = (profilesRes.data || []).map((p: { id: number }) => p.id)
    const customerIds = (customersRes.data || []).map((c: { id: number }) => c.id)

    const orConditions: string[] = [`vehicle_number.ilike.%${search}%`]
    if (centerIds.length > 0) orConditions.push(`center_id.in.(${centerIds.join(",")})`)
    if (profileIds.length > 0) orConditions.push(`profile_id.in.(${profileIds.join(",")})`)
    if (customerIds.length > 0) orConditions.push(`customer_id.in.(${customerIds.join(",")})`)
    query = query.or(orConditions.join(","))
  }

  // Apply column filters — only use actual DB columns
  if (filters.rate_id)     query = query.eq("rate_id",     filters.rate_id     as number)
  if (filters.center_id)   query = query.eq("center_id",   filters.center_id   as number)
  if (filters.customer_id) query = query.eq("customer_id", filters.customer_id as number)
  if (filters.profile_id)  query = query.eq("profile_id",  filters.profile_id  as number)

  query = applyPaginationAndSorting(query, params, {
    center_name: "center_id",
    profile_name: "profile_id",
    profile_aadhar: "profile_id",
    customer_name: "customer_id",
    customer_govt_id: "customer_id",
    commodity_name: "rate_id",
    unit_price: "rate_id",
    unit: "rate_id",
  })

  const { data, count } = await executePaginatedQuery(query)

  return { data: enrichWeighments(data), count }
}

