/**
 * @file lib/services/customers/paginated.ts
 * @description Database service logic for paginated fetching of customers.
 */

import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"
import { type Customer } from "@/types"
import { buildPaginatedQuery, enrichCustomers } from "./query"
import { supabase } from "@/lib/supabase"
import { TABLE_NAME as VILLAGES_TABLE } from "../villages"

export async function fetchCustomersPaginated(params: PaginatedParams): Promise<{ data: Customer[]; count: number }> {
  const { search, filters = {} } = params

  let query = buildPaginatedQuery()



  if (search) {
    const { data: villages } = await supabase.from(VILLAGES_TABLE).select("id").ilike("name", `%${search}%`)
    const villageIds = (villages || []).map((v: { id: number }) => v.id)
    if (villageIds.length > 0) {
      query = query.or(`name.ilike.%${search}%,father_name.ilike.%${search}%,village_id.in.(${villageIds.join(",")})`)
    } else {
      query = query.or(`name.ilike.%${search}%,father_name.ilike.%${search}%`)
    }
  }

  // Apply column filters
  if (filters.village_id) query = query.eq("village_id", filters.village_id as number)

  query = applyPaginationAndSorting(query, params, {
    village_name: "village_id",
    user_email: "user_id",
  })

  const { data, count } = await executePaginatedQuery(query)

  const enrichedData = await enrichCustomers(data)

  return { data: enrichedData, count }
}


