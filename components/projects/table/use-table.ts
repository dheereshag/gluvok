import * as React from "react"
import { type EntityRecord } from "@/types"
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { getProjectColumns } from "@/components/projects/columns"
import { ProjectSlug, EntityKey } from "@/lib/fields"
import { useProjectStoreSync, useProjectDialogStates } from "./use-helpers"

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
  const columns = React.useMemo<ColumnDef<EntityRecord>[]>(() => {
    return getProjectColumns(projectSlug, primaryIdKey, projectName, {
      onEdit: setEditingItem,
      onDelete: setDeletingItem,
    })
  }, [projectSlug, primaryIdKey, projectName, setEditingItem, setDeletingItem])

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
    if (projectSlug === ProjectSlug.COMMODITY_PRICES) return EntityKey.COMMODITY_NAME
    return EntityKey.NAME
  }, [projectSlug])

  return { table, isLoading, filterKey, ...dialogStates }
}
