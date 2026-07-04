/**
 * @file lib/services/rates/list.ts
 * @description Database service logic for listing of rates.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeAndOrderList } from "../scoping"

export async function fetchRates(id?: number): Promise<EntityRecord[]> {
  const query = supabase.from("rates").select(`
    *,
    commodity:commodities(id, name),
    factory:factories(id, name)
  `)

  if (id === undefined) {
  }

  const data = await executeAndOrderList(query, id)

  return data.map((item) => ({
    ...item,
    commodity_name: item.commodity?.name,
    factory_name: item.factory?.name,
  }))
}
