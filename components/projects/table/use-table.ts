import * as React from "react"
import { type EntityRecord } from "@/types"
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table"
import { useReactTable } from "@/lib/utils"
import { getProjectColumns } from "@/components/projects/columns"
import { ProjectSlug, EntityKey } from "@/lib/fields"
import { useProjectStoreSync, useProjectDialogStates } from "./use-helpers"
import { useAuthStore, getPermissions, resetAllEntitiesData } from "@/lib/store"
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

    resetAllEntitiesData()

    setTimeout(() => {
      setIsReloading(false)
      toast.success("All tables reloaded", {
        description: `Reset all dashboard data back to initial seed state.`,
      })
    }, 600)
  }, [])

  return {
    table,
    isLoading: isLoading || isReloading,
    filterKey,
    permissions,
    handleReload,
    ...dialogStates
  }
}
