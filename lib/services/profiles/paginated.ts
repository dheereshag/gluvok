/**
 * @file lib/services/profiles/paginated.ts
 * @description Service for fetching paginated profiles with search and filters.
 */

import {
  applyPaginationAndSorting,
  applyColumnFilters,
  addInCondition,
  executePaginatedQuery,
  type PaginatedParams,
} from "../scoping"
import { type Profile } from "@/types"
import { buildPaginatedQuery, enrichProfile } from "./query"
import { supabase } from "@/lib/supabase"
import { TABLE_NAME as FACTORIES_TABLE } from "../factories"
import { EntityKey } from "@/lib/constants/enums"

export async function fetchProfilesPaginated(params: PaginatedParams): Promise<{ data: Profile[]; count: number }> {
  const { search, filters = {} } = params

  let query = buildPaginatedQuery()

  if (search) {
    const { data: factories } = await supabase.from(FACTORIES_TABLE).select(EntityKey.ID).ilike(EntityKey.NAME, `%${search}%`)

    const orConditions: string[] = [
      `${EntityKey.NAME}.ilike.%${search}%`,
      `${EntityKey.AADHAR_NUMBER}.ilike.%${search}%`,
    ]
    addInCondition(orConditions, EntityKey.FACTORY_ID, factories)
    query = query.or(orConditions.join(","))
  }

  // Apply column filters
  query = applyColumnFilters(query, filters)

  query = applyPaginationAndSorting(query, params, {
    [EntityKey.FACTORY_NAME]: EntityKey.FACTORY_ID,
    [EntityKey.EMAIL]: EntityKey.USER_ID,
  })

  const { data, count } = await executePaginatedQuery(query)

  return { data: data.map(enrichProfile), count }
}
