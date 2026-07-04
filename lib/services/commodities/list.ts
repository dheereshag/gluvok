/**
 * @file lib/services/commodities/list.ts
 * @description Database service logic for listing of commodities.
 */

import { type Commodity } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"
import { buildListQuery } from "./query"

export async function fetchCommodities(): Promise<Commodity[]> {
  return executeListQuery(buildListQuery())
}

export async function fetchCommodityById(id: number): Promise<Commodity> {
  return executeSingleQuery(buildListQuery(), id)
}
