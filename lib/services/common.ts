/**
 * @file lib/services/common.ts
 * @description Database service logic for CRUD operations of services.
 */

import { supabase } from "@/lib/supabase"
import { ProjectSlug, EntityKey } from "@/lib/constants/enums"
import { type EntityRecord } from "@/types"
import { fetchCenters, fetchCentersPaginated, fetchCenterById } from "./centers"
import { fetchCommodities, fetchCommoditiesPaginated, fetchCommodityById } from "./commodities"
import { fetchRates, fetchRatesPaginated, fetchRateById } from "./rates"
import { fetchCustomers, fetchCustomersPaginated, fetchCustomerById } from "./customers"
import { fetchWeighments, fetchWeighmentsPaginated, fetchWeighmentById } from "./weighments"
import { fetchFactories, fetchFactoriesPaginated, fetchFactoryById } from "./factories"
import { fetchProfiles, fetchProfilesPaginated, fetchProfileById } from "./profiles"
import { type PaginatedParams } from "./scoping"

interface ServiceMethods {
  fetchSingle: (id: number) => Promise<EntityRecord>
  fetchList: () => Promise<EntityRecord[]>
  fetchPaginated: (params: PaginatedParams) => Promise<{ data: EntityRecord[]; count: number }>
}

/** Declarative registry mapping each entity ProjectSlug to its corresponding CRUD service handlers */
const ENTITY_SERVICES: Record<ProjectSlug, ServiceMethods> = {
  [ProjectSlug.CENTERS]: { fetchSingle: fetchCenterById, fetchList: fetchCenters, fetchPaginated: fetchCentersPaginated },
  [ProjectSlug.COMMODITIES]: { fetchSingle: fetchCommodityById, fetchList: fetchCommodities, fetchPaginated: fetchCommoditiesPaginated },
  [ProjectSlug.RATES]: { fetchSingle: fetchRateById, fetchList: fetchRates, fetchPaginated: fetchRatesPaginated },
  [ProjectSlug.CUSTOMERS]: { fetchSingle: fetchCustomerById, fetchList: fetchCustomers, fetchPaginated: fetchCustomersPaginated },
  [ProjectSlug.WEIGHMENTS]: { fetchSingle: fetchWeighmentById, fetchList: fetchWeighments, fetchPaginated: fetchWeighmentsPaginated },
  [ProjectSlug.FACTORIES]: { fetchSingle: fetchFactoryById, fetchList: fetchFactories, fetchPaginated: fetchFactoriesPaginated },
  [ProjectSlug.PROFILES]: { fetchSingle: fetchProfileById, fetchList: fetchProfiles, fetchPaginated: fetchProfilesPaginated },
}

export async function fetchSingleEntity(slug: ProjectSlug, id: number): Promise<EntityRecord> {
  const service = ENTITY_SERVICES[slug]
  if (!service) {
    throw new Error(`No fetch configured for single entity slug: ${slug}`)
  }
  return service.fetchSingle(id)
}

export async function fetchEntityList(slug: ProjectSlug | string): Promise<EntityRecord[]> {
  const service = ENTITY_SERVICES[slug as ProjectSlug]
  if (!service) {
    throw new Error(`Unknown project slug: ${slug}`)
  }
  return service.fetchList()
}

export async function fetchEntityListPaginated(
  slug: ProjectSlug,
  params: PaginatedParams
): Promise<{ data: EntityRecord[]; count: number }> {
  const service = ENTITY_SERVICES[slug]
  if (!service) {
    throw new Error(`Pagination not configured for slug: ${slug}`)
  }
  return service.fetchPaginated(params)
}

// Mutate functions
export async function insertRow(slug: ProjectSlug, record: Record<string, unknown>): Promise<EntityRecord> {
  const table = slug
  const { data, error } = await supabase.from(table).insert(record).select(EntityKey.ID).maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) {
    throw new Error(`Failed to insert row into table "${table}". You may not have write permission (RLS) for this table.`)
  }
  return fetchSingleEntity(slug, data.id)
}

export async function updateRow(slug: ProjectSlug, id: number, record: Record<string, unknown>): Promise<EntityRecord> {
  const table = slug
  const { data, error } = await supabase.from(table).update(record).eq(EntityKey.ID as never, id).select(EntityKey.ID).maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) {
    throw new Error(`Row with id ${id} in table "${table}" not found, or you do not have permission (RLS) to update it.`)
  }
  return fetchSingleEntity(slug, data.id)
}

export async function deleteRow(slug: ProjectSlug, id: number): Promise<void> {
  const table = slug
  const { error } = await supabase.from(table).delete().eq(EntityKey.ID as never, id)
  if (error) throw new Error(error.message)
}
