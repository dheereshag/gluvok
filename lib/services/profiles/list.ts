/**
 * @file lib/services/profiles/list.ts
 * @description Database service logic for listing of profiles.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"

export async function fetchProfiles(): Promise<EntityRecord[]> {
  const query = supabase.from("profiles_with_email").select(`
    *,
    factory:factories(name)
  `)

  const data = await executeListQuery(query)

  return data.map((item) => ({
    ...item,
    factory_name: item.factory?.name || "",
  }))
}

export async function fetchProfileById(id: number): Promise<EntityRecord> {
  const query = supabase.from("profiles_with_email").select(`
    *,
    factory:factories(name)
  `)

  const item = await executeSingleQuery(query, id)

  return {
    ...item,
    factory_name: item.factory?.name || "",
  }
}

