import * as React from "react"
import { type EntityRecord } from "@/types"
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table"
import { useReactTable } from "@/lib/utils"
import { getProjectColumns } from "@/components/projects/columns"
import { ProjectSlug, EntityKey } from "@/lib/constants/enums"
import { useProjectStoreSync, useProjectDialogStates } from "./use-helpers"
import { useAuthStore, getPermissions, useEntitiesStore } from "@/lib/store"
import { fetchWeighmentsPaginated } from "@/lib/services"

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
  const { tableData, isLoading } = useProjectStoreSync(projectSlug)
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
        visibility[colId] = savedVisibleColumns.includes(colId)
      }
    })
    return visibility
  }, [savedVisibleColumns, columns])

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialColumnVisibility)
  const [prevSlug, setPrevSlug] = React.useState(projectSlug)
  const [prevProfileId, setPrevProfileId] = React.useState(profile?.id)

  const [weighmentsData, setWeighmentsData] = React.useState<EntityRecord[]>([])
  const [weighmentsCount, setWeighmentsCount] = React.useState(0)
  const [weighmentsLoading, setWeighmentsLoading] = React.useState(false)

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const isWeighments = projectSlug === ProjectSlug.WEIGHMENTS
  const weighmentsUpdatedTrigger = useEntitiesStore((state) => state.weighmentsUpdatedTrigger)

  if (projectSlug !== prevSlug || profile?.id !== prevProfileId) {
    setPrevSlug(projectSlug)
    setPrevProfileId(profile?.id)
    setColumnVisibility(initialColumnVisibility)
    setPagination({ pageIndex: 0, pageSize: 10 })
  }

  React.useEffect(() => {
    if (!isWeighments) return

    let cancelled = false
    async function load() {
      try {
        setWeighmentsLoading(true)
        const result = await fetchWeighmentsPaginated({
          page: pagination.pageIndex,
          pageSize: pagination.pageSize,
          sortColumn: sorting[0]?.id,
          sortDesc: sorting[0]?.desc,
          search: globalFilter,
        })
        if (!cancelled) {
          setWeighmentsData(result.data)
          setWeighmentsCount(result.count)
        }
      } catch (err) {
        console.error("Failed to load paginated weighments:", err)
      } finally {
        if (!cancelled) setWeighmentsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [isWeighments, pagination, sorting, globalFilter, weighmentsUpdatedTrigger])

  const table = useReactTable({
    data: isWeighments ? weighmentsData : tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isWeighments ? undefined : getPaginationRowModel(),
    getSortedRowModel: isWeighments ? undefined : getSortedRowModel(),
    getFilteredRowModel: isWeighments ? undefined : getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: isWeighments,
    manualSorting: isWeighments,
    manualFiltering: isWeighments,
    pageCount: isWeighments ? Math.ceil(weighmentsCount / pagination.pageSize) : undefined,
    state: { 
      sorting, 
      columnFilters, 
      columnVisibility, 
      rowSelection, 
      globalFilter,
      pagination: isWeighments ? pagination : undefined,
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


  const filterKey = React.useMemo(() => {
    switch (projectSlug) {
      case ProjectSlug.ASSIGNMENTS:
        return EntityKey.PROFILE_NAME
      case ProjectSlug.AFFILIATIONS:
        return EntityKey.CUSTOMER_NAME
      case ProjectSlug.WEIGHMENTS:
        return EntityKey.VEHICLE_NUMBER
      case ProjectSlug.RATES:
        return EntityKey.COMMODITY_NAME
      default:
        return EntityKey.NAME
    }
  }, [projectSlug])

  const handleReload = React.useCallback(() => {
    if (isWeighments) {
      setPagination({ pageIndex: 0, pageSize: pagination.pageSize })
      setSorting([])
      setGlobalFilter("")
      useEntitiesStore.getState().triggerWeighmentsUpdate()
    } else {
      window.location.reload()
    }
  }, [isWeighments, pagination.pageSize])

  return {
    table,
    isLoading: isWeighments ? weighmentsLoading : isLoading,
    filterKey,
    permissions,
    handleReload,
    ...dialogStates
  }
}
