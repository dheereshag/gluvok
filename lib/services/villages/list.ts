/**
 * @file lib/services/villages/list.ts
 * @description Database service logic for listing of villages.
 */

import { type Village } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"
import { buildListQuery } from "./query"

export async function fetchVillages(): Promise<Village[]> {
  return executeListQuery(buildListQuery())
}

export async function fetchVillageById(id: number): Promise<Village> {
  return executeSingleQuery(buildListQuery(), id)
}



