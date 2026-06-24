import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"

export async function fetchCommodities(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("commodities").select("*")
  if (id !== undefined) {
    query = query.eq("id", id)
  }
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data || []
}
