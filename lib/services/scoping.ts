import { useAuthStore } from "@/lib/store/auth"
import { Role } from "@/lib/constants/enums"

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

// The `query` param is a Supabase PostgrestFilterBuilder whose generic type
// depends on the generated DB schema. Until Supabase types are generated,
// we use `unknown` and cast internally — suppressed per-line below.

export function applyPaginationAndSorting(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  params: PaginatedParams,
  sortMap: Record<string, string> = {},
  defaultSort = "updated_at"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const { page, pageSize, sortColumn, sortDesc } = params
  const from = page * pageSize
  const to = from + pageSize - 1

  const mappedSortColumn = sortColumn ? sortMap[sortColumn] || sortColumn : defaultSort
  const isAscending = sortColumn ? (sortDesc !== undefined ? !sortDesc : false) : false
  return query
    .order(mappedSortColumn, { ascending: isAscending })
    .range(from, to)
}

export async function executeAndOrderList(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  id?: number,
  defaultOrder = "updated_at"
): Promise<any[]> { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (id !== undefined) {
    query = query.eq("id", id)
  } else {
    query = query.order(defaultOrder, { ascending: false })
  }
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data || []
}

export async function executePaginatedQuery(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any
): Promise<{ data: any[]; count: number }> { // eslint-disable-line @typescript-eslint/no-explicit-any
  const { data, count, error } = await query
  if (error) throw new Error(error.message)
  return { data: data || [], count: count || 0 }
}
