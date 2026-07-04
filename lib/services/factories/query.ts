/**
 * @file lib/services/factories/query.ts
 * @description Query definition and row mapping for the factories entity.
 */

import { supabase } from "@/lib/supabase"
import { type Factory } from "@/types"
import { ProjectSlug } from "@/lib/constants/enums"

export const TABLE_NAME = ProjectSlug.FACTORIES

export const SELECT_QUERY = `
  *,
  village:villages(id, name)
`

export const buildListQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY)

export const buildPaginatedQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY, { count: "exact" })

export function enrichFactory(item: {
  village?: { id: number; name: string } | null
}): Factory {
  return {
    ...item,
    village_name: item.village?.name,
  } as Factory
}
