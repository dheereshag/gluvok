/**
 * @file lib/services/centers/list.ts
 * @description Database service logic for listing of centers.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"

const SELECT_QUERY = `
  *,
  factory:factories(id, name)
`

const buildQuery = () => supabase.from("centers").select(SELECT_QUERY)

function enrichCenter<T extends { factory?: { id: number; name: string } | null }>(
  item: T
): EntityRecord {
  return {
    ...item,
    factory_name: item.factory?.name,
  } as unknown as EntityRecord
}


export async function fetchCenters(): Promise<EntityRecord[]> {
  const data = await executeListQuery(buildQuery())
  return data.map(enrichCenter)
}

export async function fetchCenterById(id: number): Promise<EntityRecord> {
  const item = await executeSingleQuery(buildQuery(), id)
  return enrichCenter(item)
}
