/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"

export async function fetchCustomers(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("customers").select(`
    *,
    village:villages(id, name)
  `)

  if (id !== undefined) {
    query = query.eq("id", id)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data || []).map((item: any) => {
    return {
      ...item,
      village_name: item.village?.name,
    }
  })
}
