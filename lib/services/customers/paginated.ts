/**
 * @file lib/services/customers/paginated.ts
 * @description Database service logic for paginated fetching of customers.
 */

import { applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"
import { type Customer } from "@/types"
import { buildPaginatedQuery, enrichCustomers } from "./query"
import { EntityKey } from "@/lib/constants/enums"

export async function fetchCustomersPaginated(params: PaginatedParams): Promise<{ data: Customer[]; count: number }> {
  const { search } = params

  let query = buildPaginatedQuery()

  if (search) {
    query = query.or(`${EntityKey.NAME}.ilike.%${search}%,${EntityKey.FATHER_NAME}.ilike.%${search}%`)
  }

  query = applyPaginationAndSorting(query, params, {
    [EntityKey.USER_EMAIL]: EntityKey.USER_ID,
  })

  const { data, count } = await executePaginatedQuery(query)

  const enrichedData = await enrichCustomers(data)

  return { data: enrichedData, count }
}


