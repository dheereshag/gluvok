/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"

import { executeAndOrderList } from "../scoping"

export async function fetchCustomers(id?: number): Promise<EntityRecord[]> {
  const query = supabase.from("customers").select(`
    *,
    village:villages(id, name)
  `)

  const data = await executeAndOrderList(query, id)
  const userIds = data.map((item: any) => item.user_id).filter(Boolean)
  let profiles: any[] = []
  if (userIds.length > 0) {
    const { data: profileData } = await supabase
      .from("profiles_with_email")
      .select("user_id, email")
      .in("user_id", userIds)
    profiles = profileData || []
  }

  return data.map((item: any) => {
    const profile = item.user_id ? profiles.find((p: any) => p.user_id === item.user_id) : null
    return {
      ...item,
      village_name: item.village?.name,
      user_email: profile?.email || item.user_id || undefined,
    }
  })
}
