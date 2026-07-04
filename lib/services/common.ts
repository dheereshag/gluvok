/**
 * @file lib/services/common.ts
 * @description Database service logic for CRUD operations of services.
 */


import { supabase } from "@/lib/supabase"
import { ProjectSlug } from "@/lib/constants/enums"
import { type EntityRecord } from "@/types"
import { fetchCenters, fetchCentersPaginated } from "./centers"
import { fetchCommodities, fetchCommoditiesPaginated } from "./commodities"
import { fetchRates, fetchRatesPaginated } from "./rates"
import { fetchCustomers, fetchCustomersPaginated } from "./customers"
import { fetchWeighments, fetchWeighmentsPaginated } from "./weighments"
import { fetchFactories, fetchFactoriesPaginated } from "./factories"
import { fetchProfiles, fetchProfilesPaginated } from "./profiles"
import { fetchVillages, fetchVillagesPaginated } from "./villages"
import { type PaginatedParams } from "./scoping"

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

    default:
      throw new Error(`Unknown project slug: ${slug}`)
  }
}

export async function fetchEntityListPaginated(
  slug: ProjectSlug,
  params: PaginatedParams
): Promise<{ data: EntityRecord[]; count: number }> {
  switch (slug) {
    case ProjectSlug.CENTERS:
      return fetchCentersPaginated(params)
    case ProjectSlug.RATES:
      return fetchRatesPaginated(params)
    case ProjectSlug.CUSTOMERS:
      return fetchCustomersPaginated(params)
    case ProjectSlug.WEIGHMENTS:
      return fetchWeighmentsPaginated(params)
    case ProjectSlug.FACTORIES:
      return fetchFactoriesPaginated(params)
    case ProjectSlug.PROFILES:
      return fetchProfilesPaginated(params)
    case ProjectSlug.VILLAGES:
      return fetchVillagesPaginated(params)
    case ProjectSlug.COMMODITIES:
      return fetchCommoditiesPaginated(params)
    default:
      throw new Error(`Pagination not configured for slug: ${slug}`)
  }
}

// Mutate functions
export async function insertRow(slug: ProjectSlug, record: Record<string, unknown>): Promise<EntityRecord> {
  const table = slugToTable(slug)
  const { data, error } = await supabase.from(table).insert(record).select("id").maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) {
    throw new Error(`Failed to insert row into table "${table}". You may not have write permission (RLS) for this table.`)
  }
  return fetchSingleEntity(slug, data.id)
}

export async function updateRow(slug: ProjectSlug, id: number, record: Record<string, unknown>): Promise<EntityRecord> {
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
