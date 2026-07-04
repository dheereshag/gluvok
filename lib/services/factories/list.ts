/**
 * @file lib/services/factories/list.ts
 * @description Database service logic for listing of factories.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"

const SELECT_QUERY = `
  *,
  village:villages(id, name)
`

export async function fetchFactories(): Promise<EntityRecord[]> {
  const query = supabase.from("factories").select(SELECT_QUERY)

  const data = await executeListQuery(query)

  return data.map((item) => ({
    ...item,
    village_name: item.village?.name,
  }))
}

export async function fetchFactoryById(id: number): Promise<EntityRecord> {
  const query = supabase.from("factories").select(SELECT_QUERY)

  const item = await executeSingleQuery(query, id)

  return {
    ...item,
    village_name: item.village?.name,
  }
}


