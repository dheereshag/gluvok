import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeAndOrderList } from "../scoping"

export async function fetchCenters(id?: number): Promise<EntityRecord[]> {
  const query = supabase.from("centers").select(`
    *,
    factory:factories(id, name)
  `)

  if (id === undefined) {
  }

  const data = await executeAndOrderList(query, id)

  return data.map((item) => ({
    ...item,
    factory_name: item.factory?.name,
  }))
}
