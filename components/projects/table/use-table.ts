/**
 * @file components/projects/table/use-table.ts
 * @description Hook managing state (sorting, filters, pagination, column preferences, row selection) for dynamic tables.
 * Column visibility and filter preferences are persisted to localStorage via usePreferencesStore.
 */

import React from "react"
import { type EntityRecord } from "@/types"
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, getCoreRowModel } from "@tanstack/react-table"
import { useReactTable } from "@/lib/utils"
import { getProjectColumns } from "@/components/projects/columns"
import { ProjectSlug } from "@/lib/constants/enums"
import { useProjectDialogStates, parseColumnFilters, areFiltersEqual, getVisibleColumnsList, isStringArrayEqual } from "./use-helpers"
import { useAuthStore, getPermissions, useEntitiesStore, usePreferencesStore } from "@/lib/store"
import { fetchEntityListPaginated } from "@/lib/services"

/** Stable empty object — avoids creating a new reference on every render in Zustand selectors */
const EMPTY_FILTERS: Record<string, unknown> = {}

interface UseProjectTableProps {
  projectSlug: string
  primaryIdKey: string
  projectName: string
}

/**
 * useProjectTable Hook
 * Manages queries, page indexes, column visibility states, and connects tables to TanStack Table instance.
 */
export function useProjectTable({
  projectSlug,
  primaryIdKey,
  projectName,
}: UseProjectTableProps) {
  const dialogStates = useProjectDialogStates()
  const user = useAuthStore((state) => state.user)

  // Read preferences from localStorage-backed store
  const savedFilters = usePreferencesStore((state) => state.filters[projectSlug] ?? EMPTY_FILTERS)
  const savedVisibleColumns = usePreferencesStore((state) => state.columns[projectSlug])
  const setColumnPreferences = usePreferencesStore((state) => state.setColumnPreferences)
  const setFilterPreferences = usePreferencesStore((state) => state.setFilterPreferences)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(() => {
    return Object.entries(savedFilters).map(([id, value]) => ({ id, value }))
  })
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const { setEditingItem, setDeletingItem } = dialogStates

  const hasSyncedInitialFilters = React.useRef(Object.keys(savedFilters).length > 0)
  React.useEffect(() => {
    if (!hasSyncedInitialFilters.current && Object.keys(savedFilters).length > 0) {
      setColumnFilters(Object.entries(savedFilters).map(([id, value]) => ({ id, value })))
      hasSyncedInitialFilters.current = true
    }
  }, [savedFilters])

  React.useEffect(() => {
    const filtersObj = parseColumnFilters(columnFilters)
    if (!areFiltersEqual(filtersObj, savedFilters)) {
      setFilterPreferences(projectSlug, filtersObj)
    }
  }, [columnFilters, projectSlug, savedFilters, setFilterPreferences])

  const permissions = React.useMemo(() => getPermissions(user?.role, projectSlug), [user?.role, projectSlug])

  const columns = React.useMemo<ColumnDef<EntityRecord>[]>(() => {
    return getProjectColumns(projectSlug, primaryIdKey, projectName, {
      onEdit: setEditingItem,
      onDelete: setDeletingItem,
    }, permissions)
  }, [projectSlug, primaryIdKey, projectName, setEditingItem, setDeletingItem, permissions])

  const initialColumnVisibility = React.useMemo(() => {
    if (!savedVisibleColumns) return {}
    const visibility: VisibilityState = {}
    columns.forEach((col) => {
      const colId = col.id || ('accessorKey' in col ? String(col.accessorKey) : undefined)
      if (colId) {
        if (colId === "actions" || colId === "select") {
          visibility[colId] = true
        } else {
          visibility[colId] = savedVisibleColumns.includes(colId)
        }
      }
    })
    return visibility
  }, [savedVisibleColumns, columns])

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialColumnVisibility)

  const [localData, setLocalData] = React.useState<EntityRecord[]>([])
  const [localCount, setLocalCount] = React.useState(0)
  const [localLoading, setLocalLoading] = React.useState(true)

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const entitiesUpdatedTrigger = useEntitiesStore((state) => state.entitiesUpdatedTrigger)

  // Debounced search logic to prevent spamming Supabase requests
  const [debouncedFilter, setDebouncedFilter] = React.useState(globalFilter)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(globalFilter)
      // Reset to first page when search filter changes
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [globalFilter])

  React.useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLocalLoading(true)
        const filtersObj = parseColumnFilters(columnFilters)

        const result = await fetchEntityListPaginated(projectSlug as ProjectSlug, {
          page: pagination.pageIndex,
          pageSize: pagination.pageSize,
          sortColumn: sorting[0]?.id,
          sortDesc: sorting[0]?.desc,
          search: debouncedFilter,
          filters: filtersObj,
        })
        if (!cancelled) {
          setLocalData(result.data)
          setLocalCount(result.count)
        }
      } catch (err) {
        console.error(`Failed to load paginated ${projectSlug}:`, err)
      } finally {
        if (!cancelled) setLocalLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [projectSlug, pagination.pageIndex, pagination.pageSize, sorting, debouncedFilter, columnFilters, entitiesUpdatedTrigger])

  const table = useReactTable({
    data: localData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: undefined,
    getSortedRowModel: undefined,
    getFilteredRowModel: undefined,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: Math.ceil(localCount / pagination.pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
  })

  React.useEffect(() => {
    const visibleColumnsList = getVisibleColumnsList(table)
    if (!isStringArrayEqual(savedVisibleColumns, visibleColumnsList)) {
      setColumnPreferences(projectSlug, visibleColumnsList)
    }
  }, [columnVisibility, projectSlug, savedVisibleColumns, table, setColumnPreferences])

  const handleReload = React.useCallback(() => {
    useEntitiesStore.getState().triggerEntitiesUpdate()
  }, [])

  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 0)
    return () => clearTimeout(timer)
  }, [])

  return {
    table,
    isLoading: localLoading,
    isReady,
    permissions,
    handleReload,
    ...dialogStates
  }
}
