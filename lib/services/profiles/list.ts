/**
 * @file lib/services/profiles/list.ts
 * @description Database service logic for listing of profiles.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"

const TABLE_NAME = "profiles_with_email"
const SELECT_QUERY = `
  *,
  factory:factories(name)
`

const buildQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY)

function enrichProfile<T extends { factory?: { name: string } | null }>(item: T): EntityRecord {
  return {
    ...item,
    factory_name: item.factory?.name || "",
  } as unknown as EntityRecord
}


export async function fetchProfiles(): Promise<EntityRecord[]> {
  const data = await executeListQuery(buildQuery())

  return data.map(enrichProfile)
}

export async function fetchProfileById(id: number): Promise<EntityRecord> {
  const item = await executeSingleQuery(buildQuery(), id)

  return enrichProfile(item)
}
