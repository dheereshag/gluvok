/**
 * @file lib/services/factories/paginated.ts
 * @description Database service logic for paginated fetching of factories.
 */

import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"
import { type Factory } from "@/types"
import { buildPaginatedQuery, enrichFactory } from "./query"
import { supabase } from "@/lib/supabase"
import { TABLE_NAME as VILLAGES_TABLE } from "../villages"

import { EntityKey } from "@/lib/constants/enums"

export async function fetchFactoriesPaginated(params: PaginatedParams): Promise<{ data: Factory[]; count: number }> {
  const { search, filters = {} } = params

  let query = buildPaginatedQuery()


  if (search) {
    const { data: villages } = await supabase.from(VILLAGES_TABLE).select(EntityKey.ID).ilike(EntityKey.NAME, `%${search}%`)
    const villageIds = (villages || []).map((v: { id: number }) => v.id)
    if (villageIds.length > 0) {
      query = query.or(`${EntityKey.NAME}.ilike.%${search}%,${EntityKey.VILLAGE_ID}.in.(${villageIds.join(",")})`)
    } else {
      query = query.ilike(EntityKey.NAME, `%${search}%`)
    }
  }

  // Apply column filters
  if (filters.village_id) query = query.eq(EntityKey.VILLAGE_ID, filters.village_id as number)

  query = applyPaginationAndSorting(query, params, { [EntityKey.VILLAGE_NAME]: EntityKey.VILLAGE_ID })

  const { data, count } = await executePaginatedQuery(query)

  return { data: data.map(enrichFactory), count }
}

