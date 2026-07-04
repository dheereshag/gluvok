/**
 * @file lib/services/customers/query.ts
 * @description Query definition and row mapping for the customers entity.
 */

import { supabase } from "@/lib/supabase"
import { type Customer } from "@/types"
import { TABLE_NAME as PROFILES_TABLE } from "../profiles"
import { ProjectSlug, EntityKey } from "@/lib/constants/enums"

export const TABLE_NAME = ProjectSlug.CUSTOMERS

export const SELECT_QUERY = `
  *,
  village:${ProjectSlug.VILLAGES}(${EntityKey.ID}, ${EntityKey.NAME})
`

export const buildListQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY)

export const buildPaginatedQuery = () => supabase.from(TABLE_NAME).select(SELECT_QUERY, { count: "exact" })

export async function enrichCustomer(item: {
  user_id?: string | null
  village?: { id: number; name: string } | null
}): Promise<Customer> {
  let email: string | undefined = undefined
  if (item.user_id) {
    const { data } = await supabase
      .from(PROFILES_TABLE)
      .select(EntityKey.EMAIL)
      .eq(EntityKey.USER_ID, item.user_id)
      .maybeSingle()
    email = data?.email || item.user_id
  }
  return { ...item, village_name: item.village?.name, user_email: email } as Customer
}

export async function enrichCustomers(data: {
  user_id?: string | null
  village?: { id: number; name: string } | null
}[]): Promise<Customer[]> {
  const userIds = data.map((item) => item.user_id).filter(Boolean) as string[]
  let profiles: { user_id: string; email: string }[] = []
  if (userIds.length > 0) {
    const { data: profileData } = await supabase
      .from(PROFILES_TABLE)
      .select(`${EntityKey.USER_ID}, ${EntityKey.EMAIL}`)
      .in(EntityKey.USER_ID, userIds)
    profiles = (profileData || []) as { user_id: string; email: string }[]
  }

  return data.map((item) => {
    const profile = item.user_id ? profiles.find((p) => p.user_id === item.user_id) : null
    return {
      ...item,
      village_name: item.village?.name,
      user_email: profile?.email || item.user_id || undefined,
    } as Customer
  })
}
