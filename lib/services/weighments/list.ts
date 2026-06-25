import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { getScopingFilter, executeAndOrderList } from "../scoping"

export async function fetchWeighments(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("weighments").select(`
    *,
    center:centers(id, name),
    profile:profiles(id, name, aadhar_number),
    customer:customers(id, name, govt_id),
    rate:rates(id, unit_price, unit,
      commodity:commodities(id, name)
    )
  `)

  if (id === undefined) {
    const scope = await getScopingFilter()
    if (scope) {
      if (scope.customerId) {
        query = query.eq("customer_id", scope.customerId)
      } else if (!scope.isSuperAdmin && scope.factoryId) {
        const { data: centers } = await supabase
          .from("centers")
          .select("id")
          .eq("factory_id", scope.factoryId)
        const centerIds = (centers || []).map((c: { id: number }) => c.id)
        if (centerIds.length > 0) {
          query = query.in("center_id", centerIds)
        } else {
          return []
        }
      }
    }
  }

  const data = await executeAndOrderList(query, id)

  return data.map((item) => ({
    ...item,
    center_name: item.center?.name,
    profile_name: item.profile?.name,
    profile_aadhar: item.profile?.aadhar_number,
    customer_name: item.customer?.name,
    customer_govt_id: item.customer?.govt_id,
    commodity_id: item.rate?.commodity?.id,
    commodity_name: item.rate?.commodity?.name,
    unit_price: item.rate?.unit_price,
    unit: item.rate?.unit,
  }))
}
