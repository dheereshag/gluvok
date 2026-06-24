/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase"
import { type EntityRecord } from "@/types"

export async function fetchAssignments(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("assignments").select(`
    *,
    profile:profiles(id, name),
    factory:factories(id, name)
  `)

  if (id !== undefined) {
    query = query.eq("id", id)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data || []).map((item: any) => ({
    ...item,
    profile_name: item.profile?.name,
    factory_name: item.factory?.name,
  }))
}
