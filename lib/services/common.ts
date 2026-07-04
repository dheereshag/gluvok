/**
 * @file lib/services/common.ts
 * @description Database service logic for CRUD operations of services.
 */


import { supabase } from "@/lib/supabase"
import { ProjectSlug } from "@/lib/constants/enums"
import { type EntityRecord } from "@/types"
import { fetchCenters, fetchCentersPaginated, fetchCenterById } from "./centers"
import { fetchCommodities, fetchCommoditiesPaginated, fetchCommodityById } from "./commodities"
import { fetchRates, fetchRatesPaginated, fetchRateById } from "./rates"
import { fetchCustomers, fetchCustomersPaginated, fetchCustomerById } from "./customers"
import { fetchWeighments, fetchWeighmentsPaginated, fetchWeighmentById } from "./weighments"
import { fetchFactories, fetchFactoriesPaginated, fetchFactoryById } from "./factories"
import { fetchProfiles, fetchProfilesPaginated, fetchProfileById } from "./profiles"
import { fetchVillages, fetchVillagesPaginated, fetchVillageById } from "./villages"
import { type PaginatedParams } from "./scoping"


export async function fetchSingleEntity(slug: ProjectSlug, id: number): Promise<EntityRecord> {
  switch (slug) {
    case ProjectSlug.CENTERS:
      return fetchCenterById(id)
    case ProjectSlug.COMMODITIES:
      return fetchCommodityById(id)
    case ProjectSlug.RATES:
      return fetchRateById(id)
    case ProjectSlug.CUSTOMERS:
      return fetchCustomerById(id)
    case ProjectSlug.WEIGHMENTS:
      return fetchWeighmentById(id)
    case ProjectSlug.FACTORIES:
      return fetchFactoryById(id)
    case ProjectSlug.PROFILES:
      return fetchProfileById(id)
    case ProjectSlug.VILLAGES:
      return fetchVillageById(id)
    default:
      throw new Error(`No fetch configured for single entity slug: ${slug}`)
  }
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
  const table = slug
  const { data, error } = await supabase.from(table).insert(record).select("id").maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) {
    throw new Error(`Failed to insert row into table "${table}". You may not have write permission (RLS) for this table.`)
  }
  return fetchSingleEntity(slug, data.id)
}

export async function updateRow(slug: ProjectSlug, id: number, record: Record<string, unknown>): Promise<EntityRecord> {
  const table = slug
  const { data, error } = await supabase.from(table).update(record).eq("id", id).select("id").maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) {
    throw new Error(`Row with id ${id} in table "${table}" not found, or you do not have permission (RLS) to update it.`)
  }
  return fetchSingleEntity(slug, data.id)
}

export async function deleteRow(slug: ProjectSlug, id: number): Promise<void> {
  const table = slug
  const { error } = await supabase.from(table).delete().eq("id", id)
  if (error) throw new Error(error.message)
}
