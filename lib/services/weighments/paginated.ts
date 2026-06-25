import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { getScopingFilter, applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"

export async function fetchWeighmentsPaginated(params: PaginatedParams): Promise<{ data: EntityRecord[]; count: number }> {
  const { search } = params
  const scope = await getScopingFilter()
  const myFactoryIds = scope?.factoryId ? [scope.factoryId] : []

  let query = supabase.from("weighments").select(`
    *,
    center:centers(id, name),
    profile:profiles(id, name, aadhar_number),
    customer:customers(id, name, govt_id),
    rate:rates(id, unit_price, unit,
      commodity:commodities(id, name)
    )
  `, { count: "exact" })

  if (scope && !scope.isSuperAdmin) {
    if (scope.customerId) {
      query = query.eq("customer_id", scope.customerId)
    } else {
      let centerIds: number[] = []
      if (myFactoryIds.length > 0) {
        const { data: centers } = await supabase.from("centers").select("id").in("factory_id", myFactoryIds)
        centerIds = (centers || []).map((c: { id: number }) => c.id)
      }
      if (centerIds.length === 0) return { data: [], count: 0 }
      query = query.in("center_id", centerIds)
    }
  }

  if (search) {
    const { data: centers } = await supabase.from("centers").select("id").ilike("name", `%${search}%`)
    const centerIds = (centers || []).map((c: { id: number }) => c.id)
    const { data: profiles } = await supabase.from("profiles").select("id").ilike("name", `%${search}%`)
    const profileIds = (profiles || []).map((p: { id: number }) => p.id)
    const { data: customers } = await supabase.from("customers").select("id").ilike("name", `%${search}%`)
    const customerIds = (customers || []).map((c: { id: number }) => c.id)

    const orConditions: string[] = [`vehicle_number.ilike.%${search}%`]
    if (centerIds.length > 0) orConditions.push(`center_id.in.(${centerIds.join(",")})`)
    if (profileIds.length > 0) orConditions.push(`profile_id.in.(${profileIds.join(",")})`)
    if (customerIds.length > 0) orConditions.push(`customer_id.in.(${customerIds.join(",")})`)
    query = query.or(orConditions.join(","))
  }

  query = applyPaginationAndSorting(query, params, {
    center_name: "center_id",
    profile_name: "profile_id",
    customer_name: "customer_id",
  })

  const { data, count } = await executePaginatedQuery(query)

  const enrichedData = data.map((item) => ({
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

  return { data: enrichedData, count }
}
