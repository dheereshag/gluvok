/**
 * @file lib/services/commodities/query.ts
 * @description Query definition for the commodities entity.
 */

import { supabase } from "@/lib/supabase"

export const TABLE_NAME = "commodities"

export const SELECT_QUERY = "*"

export const buildListQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY)

export const buildPaginatedQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY, { count: "exact" })
