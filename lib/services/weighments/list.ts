/**
 * @file lib/services/weighments/list.ts
 * @description Database service logic for listing of weighments.
 */

import { type Weighment } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"
import { buildListQuery, enrichWeighment, enrichWeighments } from "./query"

export async function fetchWeighments(): Promise<Weighment[]> {
  const data = await executeListQuery(buildListQuery())
  return enrichWeighments(data)
}

export async function fetchWeighmentById(id: number): Promise<Weighment> {
  const item = await executeSingleQuery(buildListQuery(), id)
  return enrichWeighment(item)
}
