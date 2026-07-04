/**
 * @file lib/services/centers/list.ts
 * @description Database service logic for listing of centers.
 */

import { type Center } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"
import { buildListQuery, enrichCenter } from "./query"

export async function fetchCenters(): Promise<Center[]> {
  const data = await executeListQuery(buildListQuery())
  return data.map(enrichCenter)
}

export async function fetchCenterById(id: number): Promise<Center> {
  const item = await executeSingleQuery(buildListQuery(), id)
  return enrichCenter(item)
}

