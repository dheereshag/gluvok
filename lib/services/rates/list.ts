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

const buildQuery = () => supabase.from("rates").select(SELECT_QUERY)

function enrichRate<
  T extends { commodity?: { id: number; name: string } | null; factory?: { id: number; name: string } | null }
>(item: T): EntityRecord {
  return {
    ...item,
    commodity_name: item.commodity?.name,
    factory_name: item.factory?.name,
  } as unknown as EntityRecord
}


export async function fetchRates(): Promise<EntityRecord[]> {
  const data = await executeListQuery(buildQuery())
  return data.map(enrichRate)
}

export async function fetchRateById(id: number): Promise<EntityRecord> {
  const item = await executeSingleQuery(buildQuery(), id)
  return enrichRate(item)
}
