/**
 * @file lib/services/weighments/paginated.ts
 * @description Service for fetching paginated weighments with search and filters.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"

export async function fetchWeighmentsPaginated(params: PaginatedParams): Promise<{ data: EntityRecord[]; count: number }> {
  const { search, filters = {} } = params

  let query = supabase.from("weighments").select(`
    *,
    center:centers(id, name),
    profile:profiles(id, name, aadhar_number),
    customer:customers(id, name, govt_id),
    rate:rates(id, unit_price, unit,
      commodity:commodities(id, name)
    )
  `, { count: "exact" })

  if (search) {
    const [centersRes, profilesRes, customersRes] = await Promise.all([
      supabase.from("centers").select("id").ilike("name", `%${search}%`),
      supabase.from("profiles").select("id").ilike("name", `%${search}%`),
      supabase.from("customers").select("id").ilike("name", `%${search}%`),
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

  const enrichedData = data.map((item) => ({
    ...item,
    center_name: item.center?.name,
    profile_id: item.profile?.id,
    profile_name: item.profile?.name,
    profile_aadhar: item.profile?.aadhar_number,
    customer_id: item.customer?.id,
    customer_name: item.customer?.name,
    customer_govt_id: item.customer?.govt_id,
    commodity_id: item.rate?.commodity?.id,
    commodity_name: item.rate?.commodity?.name,
    unit_price: item.rate?.unit_price,
    unit: item.unit ?? item.rate?.unit,
  }))

  return { data: enrichedData, count }
}
