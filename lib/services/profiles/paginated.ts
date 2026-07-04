/**
 * @file lib/services/profiles/paginated.ts
 * @description Service for fetching paginated profiles with search and filters.
 */

import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"
import { type Profile } from "@/types"
import { buildPaginatedQuery, enrichProfile } from "./query"
import { supabase } from "@/lib/supabase"
import { TABLE_NAME as FACTORIES_TABLE } from "../factories"

export async function fetchProfilesPaginated(params: PaginatedParams): Promise<{ data: Profile[]; count: number }> {
  const { search, filters = {} } = params

  let query = buildPaginatedQuery()


  if (search) {
    const { data: factories } = await supabase.from(FACTORIES_TABLE).select("id").ilike("name", `%${search}%`)
    const factoryIds = (factories || []).map((f: { id: number }) => f.id)

    const orConditions: string[] = [
      `name.ilike.%${search}%`,
      `aadhar_number.ilike.%${search}%`,
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

  return { data: data.map(enrichProfile), count }
}


