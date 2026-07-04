/**
 * @file lib/services/profiles/list.ts
 * @description Database service logic for listing of profiles.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"

const SELECT_QUERY = `
  *,
  factory:factories(name)
`

export async function fetchProfiles(): Promise<EntityRecord[]> {
  const query = supabase.from("profiles_with_email").select(SELECT_QUERY)

  const data = await executeListQuery(query)

  return data.map((item) => ({
    ...item,
    factory_name: item.factory?.name || "",
  }))
}

export async function fetchProfileById(id: number): Promise<EntityRecord> {
  const query = supabase.from("profiles_with_email").select(SELECT_QUERY)

  const item = await executeSingleQuery(query, id)

  return {
    ...item,
    factory_name: item.factory?.name || "",
  }
}


