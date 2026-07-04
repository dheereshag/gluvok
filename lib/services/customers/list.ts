/**
 * @file lib/services/customers/list.ts
 * @description Database service logic for listing of customers.
 */

import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeListQuery, executeSingleQuery } from "../scoping"

const SELECT_QUERY = `
    *,
    village:villages(id, name)
`

async function enrichCustomers<
  T extends { user_id?: string | null; village?: { id: number; name: string } | null }
>(data: T[]): Promise<EntityRecord[]> {
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
    } as unknown as EntityRecord
  })

}


export async function fetchCustomers(): Promise<EntityRecord[]> {
  const query = supabase.from("customers").select(SELECT_QUERY)

  const data = await executeListQuery(query)
  return enrichCustomers(data)
}

export async function fetchCustomerById(id: number): Promise<EntityRecord> {
  const query = supabase.from("customers").select(SELECT_QUERY)

  const item = await executeSingleQuery(query, id)
  const enriched = await enrichCustomers([item])
  return enriched[0]
}


