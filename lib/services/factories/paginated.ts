/**
 * @file lib/services/factories/paginated.ts
 * @description Database service logic for paginated fetching of factories.
 */

import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"
import { type Factory } from "@/types"
import { buildPaginatedQuery, enrichFactory } from "./query"
import { supabase } from "@/lib/supabase"
import { TABLE_NAME as VILLAGES_TABLE } from "../villages"

export async function fetchFactoriesPaginated(params: PaginatedParams): Promise<{ data: Factory[]; count: number }> {
  const { search } = params

  let query = buildPaginatedQuery()


  if (search) {
    const { data: villages } = await supabase.from(VILLAGES_TABLE).select("id").ilike("name", `%${search}%`)
    const villageIds = (villages || []).map((v: { id: number }) => v.id)
    if (villageIds.length > 0) {
      query = query.or(`name.ilike.%${search}%,village_id.in.(${villageIds.join(",")})`)
    } else {
      query = query.ilike("name", `%${search}%`)
    }
  }

  query = applyPaginationAndSorting(query, params, { village_name: "village_id" })

  const { data, count } = await executePaginatedQuery(query)

  return { data: data.map(enrichFactory), count }
}

