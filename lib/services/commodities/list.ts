import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeAndOrderList } from "../scoping"

export async function fetchCommodities(id?: number): Promise<EntityRecord[]> {
  const query = supabase.from("commodities").select("*")
  return executeAndOrderList(query, id)
}
