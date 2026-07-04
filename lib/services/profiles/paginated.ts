/**
 * @file lib/services/profiles/paginated.ts
 * @description Service for fetching paginated profiles with search and filters.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"

export async function fetchProfilesPaginated(params: PaginatedParams): Promise<{ data: EntityRecord[]; count: number }> {
  const { search, filters = {} } = params

  let query = supabase.from("profiles_with_email").select(`
    *,
    factory:factories(name)
  `, { count: "exact" })

  if (search) {
    const { data: factories } = await supabase.from("factories").select("id").ilike("name", `%${search}%`)
    const factoryIds = (factories || []).map((f: { id: number }) => f.id)

    const orConditions: string[] = [
      `name.ilike.%${search}%`,
      `aadhar_number.ilike.%${search}%`
    ]
    if (factoryIds.length > 0) orConditions.push(`factory_id.in.(${factoryIds.join(",")})`)
    query = query.or(orConditions.join(","))
  }


  // Apply column filters
  if (filters.role) query = query.eq("role", filters.role as string)

  query = applyPaginationAndSorting(query, params, {
    factory_name: "factory_id",
    email: "user_id",
  })

  const { data, count } = await executePaginatedQuery(query)

  const enrichedData = data.map((item) => ({
    ...item,
    factory_name: item.factory?.name || "",
  }))

  return { data: enrichedData, count }
}

