/**
 * @file lib/services/commodities/list.ts
 * @description Database service logic for listing of commodities.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"

export async function fetchCommodities(): Promise<EntityRecord[]> {
  const query = supabase.from("commodities").select("*")
  return executeListQuery(query)
}

export async function fetchCommodityById(id: number): Promise<EntityRecord> {
  const query = supabase.from("commodities").select("*")
  return executeSingleQuery(query, id)
}

