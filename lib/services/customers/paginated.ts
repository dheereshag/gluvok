/**
 * @file lib/services/customers/paginated.ts
 * @description Database service logic for paginated fetching of customers.
 */

import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"
import { type Customer } from "@/types"
import { buildPaginatedQuery, enrichCustomers } from "./query"
import { supabase } from "@/lib/supabase"
import { TABLE_NAME as VILLAGES_TABLE } from "../villages"
import { EntityKey } from "@/lib/constants/enums"

export async function fetchCustomersPaginated(params: PaginatedParams): Promise<{ data: Customer[]; count: number }> {
  const { search, filters = {} } = params

  let query = buildPaginatedQuery()



  if (search) {
    const { data: villages } = await supabase.from(VILLAGES_TABLE).select(EntityKey.ID).ilike(EntityKey.NAME, `%${search}%`)
    const villageIds = (villages || []).map((v: { id: number }) => v.id)
    if (villageIds.length > 0) {
      query = query.or(`${EntityKey.NAME}.ilike.%${search}%,${EntityKey.FATHER_NAME}.ilike.%${search}%,${EntityKey.VILLAGE_ID}.in.(${villageIds.join(",")})`)
    } else {
      query = query.or(`${EntityKey.NAME}.ilike.%${search}%,${EntityKey.FATHER_NAME}.ilike.%${search}%`)
    }
  }

  // Apply column filters
  if (filters.village_id) query = query.eq(EntityKey.VILLAGE_ID, filters.village_id as number)

  query = applyPaginationAndSorting(query, params, {
    [EntityKey.VILLAGE_NAME]: EntityKey.VILLAGE_ID,
    [EntityKey.USER_EMAIL]: EntityKey.USER_ID,
  })

  const { data, count } = await executePaginatedQuery(query)

  const enrichedData = await enrichCustomers(data)

  return { data: enrichedData, count }
}


