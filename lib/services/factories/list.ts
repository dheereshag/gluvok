/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { getScopingFilter, executeAndOrderList } from "../scoping"

export async function fetchFactories(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("factories").select(`
    *,
    village:villages(id, name)
  `)

  if (id === undefined) {
    const scope = await getScopingFilter()
    if (scope && !scope.isSuperAdmin && scope.factoryId) {
      query = query.eq("id", scope.factoryId)
    }
  }

  const data = await executeAndOrderList(query, id)

  return data.map((item: any) => ({
    ...item,
    village_name: item.village?.name,
  }))
}
