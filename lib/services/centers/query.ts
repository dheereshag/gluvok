/**
 * @file lib/services/centers/query.ts
 * @description Query definition and row mapping for the centers entity.
 */

import { supabase } from "@/lib/supabase"
import { type Center } from "@/types"
import { ProjectSlug } from "@/lib/constants/enums"

export const TABLE_NAME = ProjectSlug.CENTERS

export const SELECT_QUERY = `
  *,
  factory:factories(id, name)
`

export const buildListQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY)

export const buildPaginatedQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY, { count: "exact" })

export function enrichCenter(item: {
  factory?: { id: number; name: string } | null
}): Center {
  return {
    ...item,
    factory_name: item.factory?.name,
  } as Center
}
