/**
 * @file lib/services/profiles/list.ts
 * @description Database service logic for listing of profiles.
 */

import { type Profile } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"
import { buildListQuery, enrichProfile } from "./query"

export async function fetchProfiles(): Promise<Profile[]> {
  const data = await executeListQuery(buildListQuery())
  return data.map(enrichProfile)
}

export async function fetchProfileById(id: number): Promise<Profile> {
  const item = await executeSingleQuery(buildListQuery(), id)
  return enrichProfile(item)
}

