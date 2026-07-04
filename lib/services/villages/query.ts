/**
 * @file lib/services/villages/query.ts
 * @description Query definition for the villages entity.
 */

import { supabase } from "@/lib/supabase"
import { ProjectSlug } from "@/lib/constants/enums"

export const TABLE_NAME = ProjectSlug.VILLAGES

export const SELECT_QUERY = "*"

export const buildListQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY)

export const buildPaginatedQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY, { count: "exact" })
