/**
 * @file lib/services/rates/list.ts
 * @description Database service logic for listing of rates.
 */

import { type Rate } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"
import { buildListQuery, enrichRate } from "./query"

export async function fetchRates(): Promise<Rate[]> {
  const data = await executeListQuery(buildListQuery())
  return data.map(enrichRate)
}

export async function fetchRateById(id: number): Promise<Rate> {
  const item = await executeSingleQuery(buildListQuery(), id)
  return enrichRate(item)
}
