/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { getScopingFilter, executeAndOrderList } from "../scoping"

export async function fetchRates(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("rates").select(`
    *,
    commodity:commodities(id, name),
    factory:factories(id, name)
  `)

  if (id === undefined) {
    const scope = await getScopingFilter()
    if (scope && !scope.isSuperAdmin && scope.factoryId) {
      query = query.eq("factory_id", scope.factoryId)
    }
  }

  const data = await executeAndOrderList(query, id)

  return data.map((item: any) => ({
    ...item,
    commodity_name: item.commodity?.name,
    factory_name: item.factory?.name,
  }))
}
