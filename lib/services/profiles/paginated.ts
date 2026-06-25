/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { getScopingFilter, applyPaginationAndSorting, type PaginatedParams } from "../scoping"

export async function fetchProfilesPaginated(params: PaginatedParams): Promise<{ data: EntityRecord[]; count: number }> {
  const { search } = params
  const scope = await getScopingFilter()
  const myFactoryIds = scope?.factoryId ? [scope.factoryId] : []

  let query = supabase.from("profiles_with_email").select(`
    *,
    factory:factories(name)
  `, { count: "exact" })

  if (scope && !scope.isSuperAdmin) {
    const { data: profiles } = await supabase.from("profiles").select("id").in("factory_id", myFactoryIds)
    const userProfileId = scope.userProfileId
    const allowedProfileIds = Array.from(new Set([
      ...(profiles || []).map((p: any) => p.id),
      userProfileId
    ].filter(Boolean) as number[]))
    query = query.in("id", allowedProfileIds)
  }

  if (search) {
    const { data: factories } = await supabase.from("factories").select("id").ilike("name", `%${search}%`)
    const factoryIds = (factories || []).map((f: any) => f.id)
    let profileIdsFromFactories: number[] = []
    if (factoryIds.length > 0) {
      const { data: profiles } = await supabase.from("profiles").select("id").in("factory_id", factoryIds)
      profileIdsFromFactories = (profiles || []).map((p: any) => p.id)
    }

    const orConditions: string[] = [
      `name.ilike.%${search}%`,
      `aadhar_number.ilike.%${search}%`
    ]
    if (profileIdsFromFactories.length > 0) orConditions.push(`id.in.(${profileIdsFromFactories.join(",")})`)
    query = query.or(orConditions.join(","))
  }

  query = applyPaginationAndSorting(query, params, { factory_name: "factory_id" })

  const { data, count, error } = await query
  if (error) throw new Error(error.message)

  const enrichedData = (data || []).map((item: any) => ({
    ...item,
    factory_name: item.factory?.name || "",
  }))

  return { data: enrichedData, count: count || 0 }
}
