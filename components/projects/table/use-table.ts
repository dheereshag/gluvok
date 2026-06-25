import React from "react"
import { type EntityRecord } from "@/types"
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, getCoreRowModel } from "@tanstack/react-table"
import { useReactTable } from "@/lib/utils"
import { getProjectColumns } from "@/components/projects/columns"
import { ProjectSlug } from "@/lib/constants/enums"
import { useProjectStoreSync, useProjectDialogStates } from "./use-helpers"
import { useAuthStore, getPermissions, useEntitiesStore } from "@/lib/store"
import { fetchEntityListPaginated } from "@/lib/services"

interface UseProjectTableProps {
  projectSlug: string
  primaryIdKey: string
  projectName: string
}

export function useProjectTable({
  projectSlug,
  primaryIdKey,
  projectName,
}: UseProjectTableProps) {
  // Sync helper tables/options in background
  const { isLoading } = useProjectStoreSync(projectSlug)
  const dialogStates = useProjectDialogStates()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const { setEditingItem, setDeletingItem } = dialogStates

  const user = useAuthStore((state) => state.user)
  const profile = user?.profile
  const updateColumnPreferences = useEntitiesStore((state) => state.updateColumnPreferences)

  const savedVisibleColumns = React.useMemo(() => {
    return profile?.preferences?.[projectSlug]
  }, [profile?.preferences, projectSlug])

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
  const [prevSlug, setPrevSlug] = React.useState(projectSlug)
  const [prevProfileId, setPrevProfileId] = React.useState(profile?.id)

  const [localData, setLocalData] = React.useState<EntityRecord[]>([])
  const [localCount, setLocalCount] = React.useState(0)
  const [localLoading, setLocalLoading] = React.useState(false)

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const entitiesUpdatedTrigger = useEntitiesStore((state) => state.entitiesUpdatedTrigger)

  if (projectSlug !== prevSlug || profile?.id !== prevProfileId) {
    setPrevSlug(projectSlug)
    setPrevProfileId(profile?.id)
    setColumnVisibility(initialColumnVisibility)
    setPagination({ pageIndex: 0, pageSize: 10 })
  }

  // Debounced search logic to prevent spamming Supabase requests
  const [debouncedFilter, setDebouncedFilter] = React.useState(globalFilter)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(globalFilter)
      // Reset to first page when search filter changes
      setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    }, 0)

    return () => {
      clearTimeout(handler)
    }
  }, [globalFilter])

  React.useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLocalLoading(true)
        const result = await fetchEntityListPaginated(projectSlug as ProjectSlug, {
          page: pagination.pageIndex,
          pageSize: pagination.pageSize,
          sortColumn: sorting[0]?.id,
          sortDesc: sorting[0]?.desc,
          search: debouncedFilter,
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
  }, [projectSlug, pagination.pageIndex, pagination.pageSize, sorting, debouncedFilter, entitiesUpdatedTrigger])

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
    if (!profile?.id) return

    const visibleColumnsList = table
      .getAllLeafColumns()
      .filter((col) => col.getIsVisible())
      .map((col) => col.id)
      .filter((id) => id !== "actions")

    const hasDiff = !savedVisibleColumns ||
      savedVisibleColumns.length !== visibleColumnsList.length ||
      visibleColumnsList.some(colId => !savedVisibleColumns.includes(colId))

    if (hasDiff) {
      updateColumnPreferences(profile.id, projectSlug, visibleColumnsList)
    }
  }, [columnVisibility, profile?.id, projectSlug, savedVisibleColumns, table, updateColumnPreferences])


  const handleReload = React.useCallback(() => {
    setPagination({ pageIndex: 0, pageSize: pagination.pageSize })
    setSorting([])
    setGlobalFilter("")
    useEntitiesStore.getState().triggerEntitiesUpdate()
  }, [pagination.pageSize])

  return {
    table,
    isLoading: localLoading || isLoading,
    permissions,
    handleReload,
    ...dialogStates
  }
}
