/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase"
import { ProjectSlug } from "@/lib/constants/enums"
import { type EntityRecord } from "@/types"
import { fetchCenters } from "./centers"
import { fetchCommodities } from "./commodities"
import { fetchRates } from "./rates"
import { fetchCustomers } from "./customers"
import { fetchWeighments } from "./weighments"
import { fetchFactories } from "./factories"
import { fetchProfiles } from "./profiles"
import { fetchVillages } from "./villages"
import { fetchAssignments } from "./assignments"


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

    default:
      throw new Error(`Unknown project slug: ${slug}`)
  }
}

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

    default:
      throw new Error(`Unknown project slug: ${slug}`)
  }
}

export async function fetchEntityListPaginated(
  slug: ProjectSlug,
  params: {
    page: number
    pageSize: number
    sortColumn?: string
    sortDesc?: boolean
    search?: string
  }
): Promise<{ data: EntityRecord[]; count: number }> {
  const { page, pageSize, sortColumn, sortDesc, search } = params
  const from = page * pageSize
  const to = from + pageSize - 1

  const { useAuthStore } = await import("@/lib/store/auth")
  const { Role } = await import("@/lib/constants/enums")

  const currentUser = useAuthStore.getState().user
  let myFactoryIds: number[] = []

  if (currentUser && currentUser.role !== Role.SUPER_ADMIN && currentUser.profile) {
    const profileId = currentUser.profile.id
    const { data: assignments, error: assignmentsError } = await supabase
      .from("assignments")
      .select("factory_id")
      .eq("profile_id", profileId)

    if (assignmentsError) throw new Error(assignmentsError.message)
    myFactoryIds = (assignments || []).map((a: any) => a.factory_id)
  }

  const table = slugToTable(slug)
  let selectString = "*"

  switch (slug) {
    case ProjectSlug.CENTERS:
      selectString = `
        *,
        factory:factories(id, name)
      `
      break
    case ProjectSlug.RATES:
      selectString = `
        *,
        commodity:commodities(id, name),
        factory:factories(id, name)
      `
      break
    case ProjectSlug.CUSTOMERS:
      selectString = `
        *,
        village:villages(id, name),
        affiliations:affiliations(
          factory_id,
          factory:factories(name)
        )
      `
      break
    case ProjectSlug.WEIGHMENTS:
      selectString = `
        *,
        center:centers(id, name),
        profile:profiles(id, name, aadhar_number),
        customer:customers(id, name, govt_id),
        rate:rates(id, unit_price, unit,
          commodity:commodities(id, name)
        )
      `
      break
    case ProjectSlug.FACTORIES:
      selectString = `
        *,
        village:villages(id, name)
      `
      break
    case ProjectSlug.PROFILES:
      selectString = `
        *,
        assignments:assignments(
          factory_id,
          factory:factories(name)
        )
      `
      break
    case ProjectSlug.ASSIGNMENTS:
      selectString = `
        *,
        profile:profiles(id, name),
        factory:factories(id, name)
      `
      break

    default:
      break
  }

  const queryTable = slug === ProjectSlug.PROFILES ? "profiles_with_email" : table
  let query = supabase.from(queryTable).select(selectString, { count: "exact" })

  if (currentUser && currentUser.role !== Role.SUPER_ADMIN) {
    switch (slug) {
      case ProjectSlug.FACTORIES:
        query = query.in("id", myFactoryIds)
        break
      case ProjectSlug.CENTERS:
      case ProjectSlug.RATES:
      case ProjectSlug.ASSIGNMENTS:
        query = query.in("factory_id", myFactoryIds)
        break
      case ProjectSlug.WEIGHMENTS: {
        let centerIds: number[] = []
        if (myFactoryIds.length > 0) {
          const { data: centers } = await supabase.from("centers").select("id").in("factory_id", myFactoryIds)
          centerIds = (centers || []).map((c: any) => c.id)
        }
        if (centerIds.length === 0) return { data: [], count: 0 }
        query = query.in("center_id", centerIds)
        break
      }
      case ProjectSlug.PROFILES: {
        const { data: assignments } = await supabase.from("assignments").select("profile_id").in("factory_id", myFactoryIds)
        const userProfileId = currentUser?.profile?.id
        const allowedProfileIds = Array.from(new Set([
          ...(assignments || []).map((a: any) => a.profile_id),
          userProfileId
        ].filter(Boolean) as number[]))
        query = query.in("id", allowedProfileIds)
        break
      }
      case ProjectSlug.CUSTOMERS: {
        const { data: affiliations } = await supabase.from("affiliations").select("customer_id").in("factory_id", myFactoryIds)
        const allowedCustomerIds = (affiliations || []).map((a: any) => a.customer_id)
        query = query.in("id", allowedCustomerIds)
        break
      }
      default:
        break
    }
  }

  if (search) {
    switch (slug) {
      case ProjectSlug.CENTERS: {
        const { data: factories } = await supabase.from("factories").select("id").ilike("name", `%${search}%`)
        const factoryIds = (factories || []).map((f: any) => f.id)
        if (factoryIds.length > 0) {
          query = query.or(`name.ilike.%${search}%,factory_id.in.(${factoryIds.join(",")})`)
        } else {
          query = query.ilike("name", `%${search}%`)
        }
        break
      }
      case ProjectSlug.RATES: {
        const { data: commodities } = await supabase.from("commodities").select("id").ilike("name", `%${search}%`)
        const commodityIds = (commodities || []).map((c: any) => c.id)
        const { data: factories } = await supabase.from("factories").select("id").ilike("name", `%${search}%`)
        const factoryIds = (factories || []).map((f: any) => f.id)
        
        const orConditions: string[] = [`unit.ilike.%${search}%`]
        if (commodityIds.length > 0) orConditions.push(`commodity_id.in.(${commodityIds.join(",")})`)
        if (factoryIds.length > 0) orConditions.push(`factory_id.in.(${factoryIds.join(",")})`)
        query = query.or(orConditions.join(","))
        break
      }
      case ProjectSlug.CUSTOMERS: {
        const { data: villages } = await supabase.from("villages").select("id").ilike("name", `%${search}%`)
        const villageIds = (villages || []).map((v: any) => v.id)
        const { data: factories } = await supabase.from("factories").select("id").ilike("name", `%${search}%`)
        const factoryIds = (factories || []).map((f: any) => f.id)
        
        let customerIdsFromFactories: number[] = []
        if (factoryIds.length > 0) {
          const { data: affiliations } = await supabase.from("affiliations").select("customer_id").in("factory_id", factoryIds)
          customerIdsFromFactories = (affiliations || []).map((a: any) => a.customer_id)
        }

        const orConditions: string[] = [
          `name.ilike.%${search}%`,
          `father_name.ilike.%${search}%`
        ]
        if (villageIds.length > 0) orConditions.push(`village_id.in.(${villageIds.join(",")})`)
        if (customerIdsFromFactories.length > 0) orConditions.push(`id.in.(${customerIdsFromFactories.join(",")})`)
        query = query.or(orConditions.join(","))
        break
      }
      case ProjectSlug.WEIGHMENTS: {
        const { data: centers } = await supabase.from("centers").select("id").ilike("name", `%${search}%`)
        const centerIds = (centers || []).map((c: any) => c.id)
        const { data: profiles } = await supabase.from("profiles").select("id").ilike("name", `%${search}%`)
        const profileIds = (profiles || []).map((p: any) => p.id)
        const { data: customers } = await supabase.from("customers").select("id").ilike("name", `%${search}%`)
        const customerIds = (customers || []).map((c: any) => c.id)

        const orConditions: string[] = [`vehicle_number.ilike.%${search}%`]
        if (centerIds.length > 0) orConditions.push(`center_id.in.(${centerIds.join(",")})`)
        if (profileIds.length > 0) orConditions.push(`profile_id.in.(${profileIds.join(",")})`)
        if (customerIds.length > 0) orConditions.push(`customer_id.in.(${customerIds.join(",")})`)
        query = query.or(orConditions.join(","))
        break
      }
      case ProjectSlug.FACTORIES: {
        const { data: villages } = await supabase.from("villages").select("id").ilike("name", `%${search}%`)
        const villageIds = (villages || []).map((v: any) => v.id)
        if (villageIds.length > 0) {
          query = query.or(`name.ilike.%${search}%,village_id.in.(${villageIds.join(",")})`)
        } else {
          query = query.ilike("name", `%${search}%`)
        }
        break
      }
      case ProjectSlug.PROFILES: {
        const { data: factories } = await supabase.from("factories").select("id").ilike("name", `%${search}%`)
        const factoryIds = (factories || []).map((f: any) => f.id)
        let profileIdsFromFactories: number[] = []
        if (factoryIds.length > 0) {
          const { data: assignments } = await supabase.from("assignments").select("profile_id").in("factory_id", factoryIds)
          profileIdsFromFactories = (assignments || []).map((a: any) => a.profile_id)
        }

        const orConditions: string[] = [
          `name.ilike.%${search}%`,
          `aadhar_number.ilike.%${search}%`
        ]
        if (profileIdsFromFactories.length > 0) orConditions.push(`id.in.(${profileIdsFromFactories.join(",")})`)
        query = query.or(orConditions.join(","))
        break
      }
      case ProjectSlug.ASSIGNMENTS: {
        const { data: profiles } = await supabase.from("profiles").select("id").ilike("name", `%${search}%`)
        const profileIds = (profiles || []).map((p: any) => p.id)
        const { data: factories } = await supabase.from("factories").select("id").ilike("name", `%${search}%`)
        const factoryIds = (factories || []).map((f: any) => f.id)
        
        const orConditions: string[] = []
        if (profileIds.length > 0) orConditions.push(`profile_id.in.(${profileIds.join(",")})`)
        if (factoryIds.length > 0) orConditions.push(`factory_id.in.(${factoryIds.join(",")})`)
        if (orConditions.length > 0) {
          query = query.or(orConditions.join(","))
        } else {
          return { data: [], count: 0 }
        }
        break
      }

      case ProjectSlug.VILLAGES: {
        query = query.or(`name.ilike.%${search}%,state.ilike.%${search}%`)
        break
      }
      default:
        query = query.ilike("name", `%${search}%`)
        break
    }
  }

  const sortMap: Record<string, string> = {
    factory_name: "factory_id",
    commodity_name: "commodity_id",
    center_name: "center_id",
    profile_name: "profile_id",
    customer_name: "customer_id",
  }

  const mappedSortColumn = sortColumn ? sortMap[sortColumn] || sortColumn : "created_at"
  query = query.order(mappedSortColumn, { ascending: !sortDesc })
  query = query.range(from, to)

  const { data, count, error } = await query
  if (error) throw new Error(error.message)

  let enrichedData: EntityRecord[] = []
  const rawList = data || []

  switch (slug) {
    case ProjectSlug.CENTERS:
      enrichedData = rawList.map((item: any) => ({
        ...item,
        factory_name: item.factory?.name,
      }))
      break
    case ProjectSlug.RATES:
      enrichedData = rawList.map((item: any) => ({
        ...item,
        commodity_name: item.commodity?.name,
        factory_name: item.factory?.name,
      }))
      break
    case ProjectSlug.CUSTOMERS:
      enrichedData = rawList.map((item: any) => {
        const factory_ids = item.affiliations?.map((a: any) => a.factory_id) || []
        const factory_names = item.affiliations?.map((a: any) => a.factory?.name).filter(Boolean).join(", ") || ""
        return {
          ...item,
          village_name: item.village?.name,
          factory_ids,
          factory_names,
        }
      })
      break
    case ProjectSlug.WEIGHMENTS:
      enrichedData = rawList.map((item: any) => ({
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
      break
    case ProjectSlug.FACTORIES:
      enrichedData = rawList.map((item: any) => ({
        ...item,
        village_name: item.village?.name,
      }))
      break
    case ProjectSlug.PROFILES:
      enrichedData = rawList.map((item: any) => {
        const factory_ids = item.assignments?.map((a: any) => a.factory_id) || []
        const factory_names = item.assignments?.map((a: any) => a.factory?.name).filter(Boolean).join(", ") || ""
        return {
          ...item,
          factory_ids,
          factory_names,
        }
      })
      break
    case ProjectSlug.ASSIGNMENTS:
      enrichedData = rawList.map((item: any) => ({
        ...item,
        profile_name: item.profile?.name,
        factory_name: item.factory?.name,
      }))
      break

    default:
      enrichedData = rawList as unknown as EntityRecord[]
      break
  }

  return {
    data: enrichedData,
    count: count || 0,
  }
}

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
