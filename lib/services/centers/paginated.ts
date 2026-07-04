/**
 * @file lib/services/centers/paginated.ts
 * @description Database service logic for paginated fetching of centers.
 */

import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"

import { type Center } from "@/types"
import { buildPaginatedQuery, enrichCenter } from "./query"
import { supabase } from "@/lib/supabase"
import { TABLE_NAME as FACTORIES_TABLE } from "../factories"

import { EntityKey } from "@/lib/constants/enums"

export async function fetchCentersPaginated(params: PaginatedParams): Promise<{ data: Center[]; count: number }> {
  const { search, filters = {} } = params

  let query = buildPaginatedQuery()



  if (search) {
    const { data: factories } = await supabase.from(FACTORIES_TABLE).select(EntityKey.ID).ilike(EntityKey.NAME, `%${search}%`)
    const factoryIds = (factories || []).map((f: { id: number }) => f.id)
    if (factoryIds.length > 0) {
      query = query.or(`${EntityKey.NAME}.ilike.%${search}%,${EntityKey.FACTORY_ID}.in.(${factoryIds.join(",")})`)
    } else {
      query = query.ilike(EntityKey.NAME, `%${search}%`)
    }
  }

  // Apply column filters
  if (filters.factory_id) query = query.eq(EntityKey.FACTORY_ID, filters.factory_id as number)

  query = applyPaginationAndSorting(query, params, { [EntityKey.FACTORY_NAME]: EntityKey.FACTORY_ID })

  const { data, count } = await executePaginatedQuery(query)

  return { data: data.map(enrichCenter), count }
}

