/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase"
import { ProjectSlug } from "@/lib/constants/enums"
import { type EntityRecord } from "@/types"

// Helper to convert project slug to Supabase table name
export function slugToTable(slug: ProjectSlug | string): string {
  switch (slug) {
    case ProjectSlug.CENTERS:
      return "centers"
    case ProjectSlug.COMMODITIES:
      return "commodities"
    case ProjectSlug.RATES:
      return "rates"
    case ProjectSlug.CUSTOMERS:
      return "customers"
    case ProjectSlug.WEIGHMENTS:
      return "weighments"
    case ProjectSlug.FACTORIES:
      return "factories"
    case ProjectSlug.PROFILES:
      return "profiles"
    case ProjectSlug.VILLAGES:
      return "villages"
    case ProjectSlug.ASSIGNMENTS:
      return "assignments"
    case ProjectSlug.AFFILIATIONS:
      return "affiliations"
    default:
      throw new Error(`Unknown project slug: ${slug}`)
  }
}

export async function fetchCenters(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("centers").select(`
    *,
    factory:factories(id, name)
  `)

  if (id !== undefined) {
    query = query.eq("id", id)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data || []).map((item: any) => ({
    ...item,
    factory_name: item.factory?.name,
  }))
}

export async function fetchCommodities(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("commodities").select("*")
  if (id !== undefined) {
    query = query.eq("id", id)
  }
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data || []
}

export async function fetchRates(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("rates").select(`
    *,
    commodity:commodities(id, name),
    factory:factories(id, name)
  `)

  if (id !== undefined) {
    query = query.eq("id", id)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data || []).map((item: any) => ({
    ...item,
    commodity_name: item.commodity?.name,
    factory_name: item.factory?.name,
  }))
}

export async function fetchCustomers(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("customers").select(`
    *,
    village:villages(id, name),
    affiliations:affiliations(
      factory_id,
      factory:factories(name)
    )
  `)

  if (id !== undefined) {
    query = query.eq("id", id)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data || []).map((item: any) => {
    const factory_ids = item.affiliations?.map((a: any) => a.factory_id) || []
    const factory_names = item.affiliations?.map((a: any) => a.factory?.name).filter(Boolean).join(", ") || ""
    return {
      ...item,
      village_name: item.village?.name,
      factory_ids,
      factory_names,
    }
  })
}

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

  if (id !== undefined) {
    query = query.eq("id", id)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data || []).map((item: any) => ({
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

export async function fetchWeighmentsPaginated(params: {
  page: number
  pageSize: number
  sortColumn?: string
  sortDesc?: boolean
  search?: string
}): Promise<{ data: EntityRecord[]; count: number }> {
  const { page, pageSize, sortColumn, sortDesc, search } = params
  const from = page * pageSize
  const to = from + pageSize - 1

  const { useAuthStore } = await import("@/lib/store/auth")
  const { Role } = await import("@/lib/constants/enums")

  const currentUser = useAuthStore.getState().user
  let centerIds: number[] = []

  if (currentUser && currentUser.role !== Role.SUPER_ADMIN && currentUser.profile) {
    const profileId = currentUser.profile.id
    const { data: assignments, error: assignmentsError } = await supabase
      .from("assignments")
      .select("factory_id")
      .eq("profile_id", profileId)

    if (assignmentsError) throw new Error(assignmentsError.message)
    const factoryIds = (assignments || []).map((a: any) => a.factory_id)

    if (factoryIds.length > 0) {
      const { data: centers, error: centersError } = await supabase
        .from("centers")
        .select("id")
        .in("factory_id", factoryIds)

      if (centersError) throw new Error(centersError.message)
      centerIds = (centers || []).map((c: any) => c.id)
    }
  }

  let query = supabase.from("weighments").select(`
    *,
    center:centers(id, name),
    profile:profiles(id, name, aadhar_number),
    customer:customers(id, name, govt_id),
    rate:rates(id, unit_price, unit,
      commodity:commodities(id, name)
    )
  `, { count: "exact" })

  if (currentUser && currentUser.role !== Role.SUPER_ADMIN) {
    if (centerIds.length === 0) {
      return { data: [], count: 0 }
    }
    query = query.in("center_id", centerIds)
  }

  if (search) {
    query = query.ilike("vehicle_number", `%${search}%`)
  }

  const sortMap: Record<string, string> = {
    vehicle_number: "vehicle_number",
    weight: "weight",
    center_name: "center_id",
    profile_name: "profile_id",
    customer_name: "customer_id",
    created_at: "created_at",
  }

  const mappedSortColumn = sortColumn ? sortMap[sortColumn] || sortColumn : "created_at"
  query = query.order(mappedSortColumn, { ascending: !sortDesc })
  query = query.range(from, to)

  const { data, count, error } = await query
  if (error) throw new Error(error.message)

  const enrichedData = (data || []).map((item: any) => ({
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

  return {
    data: enrichedData,
    count: count || 0,
  }
}

export async function fetchFactories(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("factories").select(`
    *,
    village:villages(id, name)
  `)

  if (id !== undefined) {
    query = query.eq("id", id)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data || []).map((item: any) => ({
    ...item,
    village_name: item.village?.name,
  }))
}

export async function fetchProfiles(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("profiles_with_email").select(`
    *,
    assignments:assignments(
      factory_id,
      factory:factories(name)
    )
  `)

  if (id !== undefined) {
    query = query.eq("id", id)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data || []).map((item: any) => {
    const factory_ids = item.assignments?.map((a: any) => a.factory_id) || []
    const factory_names = item.assignments?.map((a: any) => a.factory?.name).filter(Boolean).join(", ") || ""
    return {
      ...item,
      factory_ids,
      factory_names,
    }
  })
}

export async function fetchVillages(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("villages").select("*")
  if (id !== undefined) {
    query = query.eq("id", id)
  }
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data || []
}

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

export async function fetchAffiliations(id?: number): Promise<EntityRecord[]> {
  let query = supabase.from("affiliations").select(`
    *,
    customer:customers(id, name),
    factory:factories(id, name)
  `)

  if (id !== undefined) {
    query = query.eq("id", id)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data || []).map((item: any) => ({
    ...item,
    customer_name: item.customer?.name,
    factory_name: item.factory?.name,
  }))
}

// Fetch any single record by slug and id, returning the enriched representation
export async function fetchSingleEntity(slug: ProjectSlug, id: number): Promise<EntityRecord> {
  let list: EntityRecord[] = []
  switch (slug) {
    case ProjectSlug.CENTERS:
      list = await fetchCenters(id)
      break
    case ProjectSlug.COMMODITIES:
      list = await fetchCommodities(id)
      break
    case ProjectSlug.RATES:
      list = await fetchRates(id)
      break
    case ProjectSlug.CUSTOMERS:
      list = await fetchCustomers(id)
      break
    case ProjectSlug.WEIGHMENTS:
      list = await fetchWeighments(id)
      break
    case ProjectSlug.FACTORIES:
      list = await fetchFactories(id)
      break
    case ProjectSlug.PROFILES:
      list = await fetchProfiles(id)
      break
    case ProjectSlug.VILLAGES:
      list = await fetchVillages(id)
      break
    case ProjectSlug.ASSIGNMENTS:
      list = await fetchAssignments(id)
      break
    case ProjectSlug.AFFILIATIONS:
      list = await fetchAffiliations(id)
      break
    default:
      throw new Error(`No fetch configured for single entity slug: ${slug}`)
  }

  if (list.length === 0) {
    throw new Error(`Record with id ${id} not found in ${slug}`)
  }
  return list[0]
}

export async function fetchEntityList(slug: ProjectSlug | string): Promise<EntityRecord[]> {
  switch (slug) {
    case ProjectSlug.CENTERS:
      return fetchCenters()
    case ProjectSlug.COMMODITIES:
      return fetchCommodities()
    case ProjectSlug.RATES:
      return fetchRates()
    case ProjectSlug.CUSTOMERS:
      return fetchCustomers()
    case ProjectSlug.WEIGHMENTS:
      return fetchWeighments()
    case ProjectSlug.FACTORIES:
      return fetchFactories()
    case ProjectSlug.PROFILES:
      return fetchProfiles()
    case ProjectSlug.VILLAGES:
      return fetchVillages()
    case ProjectSlug.ASSIGNMENTS:
      return fetchAssignments()
    case ProjectSlug.AFFILIATIONS:
      return fetchAffiliations()
    default:
      throw new Error(`Unknown project slug: ${slug}`)
  }
}

// Mutate functions
export async function insertRow(slug: ProjectSlug, record: any): Promise<EntityRecord> {
  const table = slugToTable(slug)
  const { data, error } = await supabase.from(table).insert(record).select("id").maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) {
    throw new Error(`Failed to insert row into table "${table}". You may not have write permission (RLS) for this table.`)
  }
  return fetchSingleEntity(slug, data.id)
}

export async function updateRow(slug: ProjectSlug, id: number, record: any): Promise<EntityRecord> {
  const table = slugToTable(slug)
  const { data, error } = await supabase.from(table).update(record).eq("id", id).select("id").maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) {
    throw new Error(`Row with id ${id} in table "${table}" not found, or you do not have permission (RLS) to update it.`)
  }
  return fetchSingleEntity(slug, data.id)
}

export async function deleteRow(slug: ProjectSlug, id: number): Promise<void> {
  const table = slugToTable(slug)
  const { error } = await supabase.from(table).delete().eq("id", id)
  if (error) throw new Error(error.message)
}
