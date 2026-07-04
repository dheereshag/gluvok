/**
 * @file lib/services/rates/paginated.ts
 * @description Service for fetching paginated rates with search and filters.
 */

import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"
import { type Rate } from "@/types"
import { buildPaginatedQuery, enrichRate } from "./query"
import { supabase } from "@/lib/supabase"

export async function fetchRatesPaginated(params: PaginatedParams): Promise<{ data: Rate[]; count: number }> {
  const { search } = params

  let query = buildPaginatedQuery()



  if (params.filters) {
    Object.entries(params.filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        query = query.eq(key, val)
      }
    })
  }

  if (search) {
    const [commoditiesRes, factoriesRes] = await Promise.all([
      supabase.from("commodities").select("id").ilike("name", `%${search}%`),
      supabase.from("factories").select("id").ilike("name", `%${search}%`),
    ])

    const commodityIds = (commoditiesRes.data || []).map((c: { id: number }) => c.id)
    const factoryIds = (factoriesRes.data || []).map((f: { id: number }) => f.id)

    const orConditions: string[] = [`unit.ilike.%${search}%`]
    if (commodityIds.length > 0) orConditions.push(`commodity_id.in.(${commodityIds.join(",")})`)
    if (factoryIds.length > 0) orConditions.push(`factory_id.in.(${factoryIds.join(",")})`)
    query = query.or(orConditions.join(","))
  }

  query = applyPaginationAndSorting(query, params, {
    factory_name: "factory_id",
    commodity_name: "commodity_id",
  })

  const { data, count } = await executePaginatedQuery(query)

  return { data: data.map(enrichRate), count }
}

