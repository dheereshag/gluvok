import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { getScopingFilter, applyPaginationAndSorting, executePaginatedQuery, type PaginatedParams } from "../scoping"

export async function fetchRatesPaginated(params: PaginatedParams): Promise<{ data: EntityRecord[]; count: number }> {
  const { search } = params
  const scope = await getScopingFilter()
  const myFactoryIds = scope?.factoryId ? [scope.factoryId] : []

  let query = supabase.from("rates").select(`
    *,
    commodity:commodities(id, name),
    factory:factories(id, name)
  `, { count: "exact" })

  if (scope && !scope.isSuperAdmin) {
    query = query.in("factory_id", myFactoryIds)
  }

  if (search) {
    const { data: commodities } = await supabase.from("commodities").select("id").ilike("name", `%${search}%`)
    const commodityIds = (commodities || []).map((c: { id: number }) => c.id)
    const { data: factories } = await supabase.from("factories").select("id").ilike("name", `%${search}%`)
    const factoryIds = (factories || []).map((f: { id: number }) => f.id)

    const orConditions: string[] = [`unit.ilike.%${search}%`]
    if (commodityIds.length > 0) orConditions.push(`commodity_id.in.(${commodityIds.join(",")})`)
    if (factoryIds.length > 0) orConditions.push(`factory_id.in.(${factoryIds.join(",")})`)
    query = query.or(orConditions.join(","))
  }

  query = applyPaginationAndSorting(query, params, {
    factory_name: "factory_id",
    commodity_name: "commodity_id",
  })

  const { data, count } = await executePaginatedQuery(query)

  const enrichedData = data.map((item) => ({
    ...item,
    commodity_name: item.commodity?.name,
    factory_name: item.factory?.name,
  }))

  return { data: enrichedData, count }
}
