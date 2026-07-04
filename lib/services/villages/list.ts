/**
 * @file lib/services/villages/list.ts
 * @description Database service logic for listing of villages.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeAndOrderList } from "../scoping"

export async function fetchVillages(id?: number): Promise<EntityRecord[]> {
  const query = supabase.from("villages").select("*")
  return executeAndOrderList(query, id)
}
