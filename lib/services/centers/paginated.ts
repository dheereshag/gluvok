/**
 * @file lib/services/centers/paginated.ts
 * @description Database service logic for paginated fetching of centers.
 */

import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"

import { type Center } from "@/types"
import { buildPaginatedQuery, enrichCenter } from "./query"
import { supabase } from "@/lib/supabase"
import { TABLE_NAME as FACTORIES_TABLE } from "../factories"

export async function fetchCentersPaginated(params: PaginatedParams): Promise<{ data: Center[]; count: number }> {
  const { search } = params

  let query = buildPaginatedQuery()



  if (search) {
    const { data: factories } = await supabase.from(FACTORIES_TABLE).select("id").ilike("name", `%${search}%`)
    const factoryIds = (factories || []).map((f: { id: number }) => f.id)
    if (factoryIds.length > 0) {
      query = query.or(`name.ilike.%${search}%,factory_id.in.(${factoryIds.join(",")})`)
    } else {
      query = query.ilike("name", `%${search}%`)
    }
  }

  query = applyPaginationAndSorting(query, params, { factory_name: "factory_id" })

  const { data, count } = await executePaginatedQuery(query)

  return { data: data.map(enrichCenter), count }
}

