/**
 * @file lib/services/villages/query.ts
 * @description Query definition for the villages entity.
 */

import { supabase } from "@/lib/supabase"

export const TABLE_NAME = "villages"

export const buildListQuery = () => supabase.from(TABLE_NAME).select("*")

export const buildPaginatedQuery = () => supabase.from(TABLE_NAME).select("*", { count: "exact" })
