/**
 * @file lib/services/scoping.ts
 * @description Database service logic for CRUD operations of services.
 */

import { useAuthStore } from "@/lib/store/auth"
import { Role } from "@/lib/constants/enums"
import type { PostgrestFilterBuilder } from "@supabase/supabase-js"

interface MockSchema {
  Tables: {
    [key: string]: {
      Row: Record<string, unknown>
      Insert: Record<string, unknown>
      Update: Record<string, unknown>
      Relationships: never[]
    }
  }
  Views: {
    [key: string]: {
      Row: Record<string, unknown>
      Relationships: never[]
    }
  }
  Functions: {
    [key: string]: {
      Args: Record<string, unknown>
      Returns: unknown
    }
  }
}

export type AnyQuery<T extends Record<string, unknown>> = PostgrestFilterBuilder<
  { PostgrestVersion: string },
  MockSchema,
  T,
  T[]
>

export interface ScopingFilter {
  isSuperAdmin: boolean
  factoryId?: number
  userProfileId?: number
  customerId?: number
}

export interface PaginatedParams {
  page: number
  pageSize: number
  sortColumn?: string
  sortDesc?: boolean
  search?: string
  filters?: Record<string, unknown>
}

export async function getScopingFilter(): Promise<ScopingFilter | null> {
  const currentUser = useAuthStore.getState().user
  if (!currentUser) return null

  return {
    isSuperAdmin: currentUser.role === Role.SUPER_ADMIN,
    factoryId: currentUser.profile?.factory_id ? Number(currentUser.profile.factory_id) : undefined,
    userProfileId: currentUser.profile?.id ? Number(currentUser.profile.id) : undefined,
    customerId: currentUser.customer?.id ? Number(currentUser.customer.id) : undefined,
  }
}

export function applyPaginationAndSorting<T extends Record<string, unknown>>(
  query: AnyQuery<T>,
  params: PaginatedParams,
  sortMap: Record<string, string> = {},
  defaultSort = "updated_at"
): AnyQuery<T> {
  const { page, pageSize, sortColumn, sortDesc } = params
  const from = page * pageSize
  const to = from + pageSize - 1

  const mappedSortColumn = sortColumn ? sortMap[sortColumn] || sortColumn : defaultSort
  const isAscending = sortColumn ? (sortDesc !== undefined ? !sortDesc : false) : false
  return query
    .order(mappedSortColumn, { ascending: isAscending })
    .range(from, to)
}

function checkError(error: { message: string } | null): void {
  if (error) throw new Error(error.message)
}

export async function executeListQuery<T extends Record<string, unknown>>(
  query: AnyQuery<T>,
  defaultOrder = "updated_at"
): Promise<T[]> {
  const { data, error } = await query.order(defaultOrder, { ascending: false })
  checkError(error)
  return data || []
}

export async function executeSingleQuery<T extends Record<string, unknown>>(
  query: AnyQuery<T>,
  id: number
): Promise<T> {
  const { data, error } = await query.eq("id" as never, id).maybeSingle()
  checkError(error)
  if (!data) {
    throw new Error(`Record with ID ${id} not found`)
  }
  return data as T
}

export async function executePaginatedQuery<T extends Record<string, unknown>>(
  query: AnyQuery<T>
): Promise<{ data: T[]; count: number }> {
  const { data, count, error } = await query
  checkError(error)
  return { data: data || [], count: count || 0 }
}


