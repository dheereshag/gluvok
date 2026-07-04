/**
 * @file lib/services/villages/list.ts
 * @description Database service logic for listing of villages.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"

export async function fetchVillages(): Promise<EntityRecord[]> {
  const query = supabase.from("villages").select("*")
  return executeListQuery(query)
}

export async function fetchVillageById(id: number): Promise<EntityRecord> {
  const query = supabase.from("villages").select("*")
  return executeSingleQuery(query, id)
}

