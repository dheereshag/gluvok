/**
 * @file lib/services/profiles/list.ts
 * @description Database service logic for listing of profiles.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeAndOrderList } from "../scoping"

export async function fetchProfiles(id?: number): Promise<EntityRecord[]> {
  const query = supabase.from("profiles_with_email").select(`
    *,
    factory:factories(name)
  `)


  const data = await executeAndOrderList(query, id)

  return data.map((item) => {
    return {
      ...item,
      factory_name: item.factory?.name || "",
    }
  })
}
