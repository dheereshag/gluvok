/**
 * @file lib/services/rates/query.ts
 * @description Query definition and row mapping for the rates entity.
 */

import { supabase } from "@/lib/supabase"
import { type Rate } from "@/types"

export const TABLE_NAME = "rates"

export const SELECT_QUERY = `
  *,
  commodity:commodities(id, name),
  factory:factories(id, name)
`

export const buildListQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY)

export const buildPaginatedQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY, { count: "exact" })

export function enrichRate(item: {
  commodity?: { id: number; name: string } | null
  factory?: { id: number; name: string } | null
}): Rate {
  return {
    ...item,
    commodity_name: item.commodity?.name,
    factory_name: item.factory?.name,
  } as Rate
}
