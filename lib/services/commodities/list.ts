/**
 * @file lib/services/commodities/list.ts
 * @description Database service logic for listing of commodities.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"

const buildQuery = () => supabase.from("commodities").select("*")

export async function fetchCommodities(): Promise<EntityRecord[]> {
  return executeListQuery(buildQuery())
}

export async function fetchCommodityById(id: number): Promise<EntityRecord> {
  return executeSingleQuery(buildQuery(), id)
}


