/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"
import { applyPaginationAndSorting, type PaginatedParams } from "../scoping"

export async function fetchCustomersPaginated(params: PaginatedParams): Promise<{ data: EntityRecord[]; count: number }> {
  const { search } = params

  let query = supabase.from("customers").select(`
    *,
    village:villages(id, name)
  `, { count: "exact" })

  if (search) {
    const { data: villages } = await supabase.from("villages").select("id").ilike("name", `%${search}%`)
    const villageIds = (villages || []).map((v: any) => v.id)
    if (villageIds.length > 0) {
      query = query.or(`name.ilike.%${search}%,father_name.ilike.%${search}%,village_id.in.(${villageIds.join(",")})`)
    } else {
      query = query.or(`name.ilike.%${search}%,father_name.ilike.%${search}%`)
    }
  }

  query = applyPaginationAndSorting(query, params, { village_name: "village_id" })

  const { data, count, error } = await query
  if (error) throw new Error(error.message)

  const rawList = data || []
  const userIds = rawList.map((item: any) => item.user_id).filter(Boolean)
  let profiles: any[] = []
  if (userIds.length > 0) {
    const { data: profileData } = await supabase
      .from("profiles_with_email")
      .select("user_id, email")
      .in("user_id", userIds)
    profiles = profileData || []
  }

  const enrichedData = rawList.map((item: any) => {
    const profile = item.user_id ? profiles.find((p: any) => p.user_id === item.user_id) : null
    return {
      ...item,
      village_name: item.village?.name,
      user_email: profile?.email || item.user_id || undefined,
    }
  })

  return { data: enrichedData, count: count || 0 }
}
