import * as React from "react"
import { type EntityRecord } from "@/types"
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { getProjectColumns } from "@/components/projects/columns"
import { ProjectSlug, EntityKey } from "@/lib/fields"
import { useProjectStoreSync, useProjectDialogStates } from "./use-helpers"
import { useAuthStore, getPermissions, useEntitiesStore } from "@/lib/store"
import { PROJECT_REGISTRY } from "@/lib/projects/registry"
import { toast } from "sonner"

interface UseProjectTableProps {
  projectSlug: string
  primaryIdKey: string
  projectName: string
  initialData: EntityRecord[]
}

export function useProjectTable({
  projectSlug,
  primaryIdKey,
  projectName,
  initialData,
}: UseProjectTableProps) {
  const { tableData, isLoading } = useProjectStoreSync(projectSlug, initialData)
  const dialogStates = useProjectDialogStates()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [isReloading, setIsReloading] = React.useState(false)
  const { setEditingItem, setDeletingItem } = dialogStates

  const user = useAuthStore((state) => state.user)
  const permissions = React.useMemo(() => getPermissions(user?.role, projectSlug), [user?.role, projectSlug])

  const columns = React.useMemo<ColumnDef<EntityRecord>[]>(() => {
    return getProjectColumns(projectSlug, primaryIdKey, projectName, {
      onEdit: setEditingItem,
      onDelete: setDeletingItem,
    }, permissions)
  }, [projectSlug, primaryIdKey, projectName, setEditingItem, setDeletingItem, permissions])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
  })

  const filterKey = React.useMemo(() => {
    switch (projectSlug) {
      case ProjectSlug.USERS:
      case ProjectSlug.ASSIGNMENTS:
        return EntityKey.EMAIL
      case ProjectSlug.WEIGHMENTS:
        return EntityKey.VEHICLE_NUMBER
      case ProjectSlug.RATES:
        return EntityKey.COMMODITY_NAME
      default:
        return EntityKey.NAME
    }
  }, [projectSlug])

  const handleReload = React.useCallback(() => {
    setIsReloading(true)

    // Reset store data back to registry initial data
    const setEntities = useEntitiesStore.getState().setEntities
    const initialRegistryData = PROJECT_REGISTRY[projectSlug]?.data || []
    setEntities(projectSlug, initialRegistryData)

    setTimeout(() => {
      setIsReloading(false)
      toast.success("Table reloaded", {
        description: `Reset ${projectName} data.`,
      })
    }, 100)
  }, [projectSlug, projectName])

  return {
    table,
    isLoading: isLoading || isReloading,
    filterKey,
    permissions,
    handleReload,
    ...dialogStates
  }
}
