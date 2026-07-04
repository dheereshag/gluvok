/**
 * @file lib/services/rates/list.ts
 * @description Database service logic for listing of rates.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"

const SELECT_QUERY = `
  *,
  commodity:commodities(id, name),
  factory:factories(id, name)
`

export async function fetchRates(): Promise<EntityRecord[]> {
  const query = supabase.from("rates").select(SELECT_QUERY)

  const data = await executeListQuery(query)

  return data.map((item) => ({
    ...item,
    commodity_name: item.commodity?.name,
    factory_name: item.factory?.name,
  }))
}

export async function fetchRateById(id: number): Promise<EntityRecord> {
  const query = supabase.from("rates").select(SELECT_QUERY)

  const item = await executeSingleQuery(query, id)

  return {
    ...item,
    commodity_name: item.commodity?.name,
    factory_name: item.factory?.name,
  }
}


