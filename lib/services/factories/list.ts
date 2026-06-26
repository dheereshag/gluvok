import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { executeAndOrderList } from "../scoping"

export async function fetchFactories(id?: number): Promise<EntityRecord[]> {
  const query = supabase.from("factories").select(`
    *,
    village:villages(id, name)
  `)

  if (id === undefined) {
  }

  const data = await executeAndOrderList(query, id)

  return data.map((item) => ({
    ...item,
    village_name: item.village?.name,
  }))
}
