/**
 * @file lib/services/factories/query.ts
 * @description Query definition and row mapping for the factories entity.
 */

import { supabase } from "@/lib/supabase"
import { type Factory } from "@/types"
import { ProjectSlug } from "@/lib/constants/enums"

export const TABLE_NAME = ProjectSlug.FACTORIES

export const SELECT_QUERY = "*"

export const buildListQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY)

export const buildPaginatedQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY, { count: "exact" })

export function enrichFactory(item: unknown): Factory {
  return item as Factory
}
