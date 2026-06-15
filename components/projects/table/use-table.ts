import * as React from "react"
import { type EntityRecord } from "@/types"
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { getProjectColumns } from "@/components/projects/columns"
import { ProjectSlug, EntityKey } from "@/lib/fields"
import { useProjectStoreSync, useProjectDialogStates } from "./use-helpers"
import { useAuthStore, getPermissions } from "@/lib/store"

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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  const filterKey = React.useMemo(() => {
    if (projectSlug === ProjectSlug.USERS) return EntityKey.EMAIL
    if (projectSlug === ProjectSlug.WEIGHMENTS) return EntityKey.VEHICLE_NUMBER
    if (projectSlug === ProjectSlug.RATES) return EntityKey.COMMODITY_NAME
    return EntityKey.NAME
  }, [projectSlug])

  return { table, isLoading, filterKey, permissions, ...dialogStates }
}
