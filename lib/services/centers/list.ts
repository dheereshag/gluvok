/**
 * @file lib/services/centers/list.ts
 * @description Database service logic for listing of centers.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"

export async function fetchCenters(): Promise<EntityRecord[]> {
  const query = supabase.from("centers").select(`
    *,
    factory:factories(id, name)
  `)

  const data = await executeListQuery(query)

  return data.map((item) => ({
    ...item,
    factory_name: item.factory?.name,
  }))
}

export async function fetchCenterById(id: number): Promise<EntityRecord> {
  const query = supabase.from("centers").select(`
    *,
    factory:factories(id, name)
  `)

  const item = await executeSingleQuery(query, id)

  return {
    ...item,
    factory_name: item.factory?.name,
  }
}

