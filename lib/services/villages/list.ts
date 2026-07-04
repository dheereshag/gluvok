/**
 * @file lib/services/villages/list.ts
 * @description Database service logic for listing of villages.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"

const buildQuery = () => supabase.from("villages").select("*")

export async function fetchVillages(): Promise<EntityRecord[]> {
  return executeListQuery(buildQuery())
}

export async function fetchVillageById(id: number): Promise<EntityRecord> {
  return executeSingleQuery(buildQuery(), id)
}


