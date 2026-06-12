import * as React from "react"
import { type EntityRecord } from "@/types"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useEntitiesStore } from "@/lib/store"
import { getProjectColumns } from "@/components/projects/columns"
import { ProjectSlug, EntityKey } from "@/lib/fields"

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
  const storeData = useEntitiesStore((state) => state.entities[projectSlug])
  const setEntities = useEntitiesStore((state) => state.setEntities)

  const [prevSlug, setPrevSlug] = React.useState(projectSlug)
  const [localLoading, setLocalLoading] = React.useState(true)

  if (projectSlug !== prevSlug) {
    setPrevSlug(projectSlug)
    setLocalLoading(true)
  }

  React.useEffect(() => {
    if (storeData === undefined) {
      setEntities(projectSlug, initialData)
    }
    const timer = setTimeout(() => {
      setLocalLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [projectSlug, initialData, setEntities, storeData])

  const tableData = storeData || initialData
  const isLoading = localLoading

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [editingItem, setEditingItem] = React.useState<EntityRecord | null>(null)
  const [deletingItem, setDeletingItem] = React.useState<EntityRecord | null>(null)
  const [creating, setCreating] = React.useState(false)

  const columns = React.useMemo<ColumnDef<EntityRecord>[]>(() => {
    return getProjectColumns(projectSlug, primaryIdKey, projectName, {
      onEdit: setEditingItem,
      onDelete: setDeletingItem,
    })
  }, [projectSlug, primaryIdKey, projectName])

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const filterKey = React.useMemo(() => {
    if (projectSlug === ProjectSlug.USERS) return EntityKey.EMAIL
    if (projectSlug === ProjectSlug.DATA_ENTRIES) return EntityKey.VEHICLE_NUMBER
    return EntityKey.NAME
  }, [projectSlug])

  return {
    table,
    isLoading,
    filterKey,
    creating,
    setCreating,
    editingItem,
    setEditingItem,
    deletingItem,
    setDeletingItem,
  }
}
