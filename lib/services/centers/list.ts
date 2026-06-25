import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { getScopingFilter, executeAndOrderList } from "../scoping"

export async function fetchCenters(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("centers").select(`
    *,
    factory:factories(id, name)
  `)

  if (id === undefined) {
    const scope = await getScopingFilter()
    if (scope && !scope.isSuperAdmin && scope.factoryId) {
      query = query.eq("factory_id", scope.factoryId)
    }
  }

  const data = await executeAndOrderList(query, id)

  return data.map((item) => ({
    ...item,
    factory_name: item.factory?.name,
  }))
}
