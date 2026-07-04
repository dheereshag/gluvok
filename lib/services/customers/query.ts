/**
 * @file lib/services/customers/query.ts
 * @description Query definition and row mapping for the customers entity.
 */

import { supabase } from "@/lib/supabase"
import { type Customer } from "@/types"

export const TABLE_NAME = "customers"

export const SELECT_QUERY = `
  *,
  village:villages(id, name)
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
      .from("profiles_with_email")
      .select("email")
      .eq("user_id", item.user_id)
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
      .from("profiles_with_email")
      .select("user_id, email")
      .in("user_id", userIds)
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
