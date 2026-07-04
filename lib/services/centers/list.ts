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

export async function fetchCenters(): Promise<EntityRecord[]> {
  const query = supabase.from("centers").select(SELECT_QUERY)

  const data = await executeListQuery(query)

  return data.map((item) => ({
    ...item,
    factory_name: item.factory?.name,
  }))
}

export async function fetchCenterById(id: number): Promise<EntityRecord> {
  const query = supabase.from("centers").select(SELECT_QUERY)

  const item = await executeSingleQuery(query, id)

  return {
    ...item,
    factory_name: item.factory?.name,
  }
}


