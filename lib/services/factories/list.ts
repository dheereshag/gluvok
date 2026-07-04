/**
 * @file lib/services/factories/list.ts
 * @description Database service logic for listing of factories.
 */

import { type Factory } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"
import { buildListQuery, enrichFactory } from "./query"

export async function fetchFactories(): Promise<Factory[]> {
  const data = await executeListQuery(buildListQuery())
  return data.map(enrichFactory)
}

export async function fetchFactoryById(id: number): Promise<Factory> {
  const item = await executeSingleQuery(buildListQuery(), id)
  return enrichFactory(item)
}
