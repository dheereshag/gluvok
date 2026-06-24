/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"

export async function fetchAffiliations(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("affiliations").select(`
    *,
    customer:customers(id, name),
    factory:factories(id, name)
  `)

  if (id !== undefined) {
    query = query.eq("id", id)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data || []).map((item: any) => ({
    ...item,
    customer_name: item.customer?.name,
    factory_name: item.factory?.name,
  }))
}
