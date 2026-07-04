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

const buildQuery = () => supabase.from("factories").select(SELECT_QUERY)

function enrichFactory<T extends { village?: { id: number; name: string } | null }>(
  item: T
): EntityRecord {
  return {
    ...item,
    village_name: item.village?.name,
  } as unknown as EntityRecord
}


export async function fetchFactories(): Promise<EntityRecord[]> {
  const data = await executeListQuery(buildQuery())
  return data.map(enrichFactory)
}

export async function fetchFactoryById(id: number): Promise<EntityRecord> {
  const item = await executeSingleQuery(buildQuery(), id)
  return enrichFactory(item)
}
