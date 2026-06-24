/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"

export async function fetchCustomers(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("customers").select(`
    *,
    village:villages(id, name),
    affiliations:affiliations(
      factory_id,
      factory:factories(name)
    )
  `)

  if (id !== undefined) {
    query = query.eq("id", id)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data || []).map((item: any) => {
    const factory_ids = item.affiliations?.map((a: any) => a.factory_id) || []
    const factory_names = item.affiliations?.map((a: any) => a.factory?.name).filter(Boolean).join(", ") || ""
    return {
      ...item,
      village_name: item.village?.name,
      factory_ids,
      factory_names,
    }
  })
}
