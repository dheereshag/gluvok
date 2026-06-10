"use client"

import * as React from "react"
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
  TableOptions,
} from "@tanstack/react-table"
import { Village } from "@/data/villages"
import { useVillagesStore } from "../store"

interface UseVillagesTableProps {
  columns: ColumnDef<Village, any>[]
}

function useCompilerSafeTable<TData>(options: TableOptions<TData>) {
  "use no memo"
  // eslint-disable-next-line react-hooks/incompatible-library
  return useReactTable(options)
}

export function useVillagesTable({ columns }: UseVillagesTableProps) {
  const data = useVillagesStore((state) => state.villages)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [editingVillage, setEditingVillage] = React.useState<Village | null>(null)
  const [deletingVillage, setDeletingVillage] = React.useState<Village | null>(null)

  const table = useCompilerSafeTable({
    data,
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
    meta: {
      onEdit: (village: Village) => {
        setEditingVillage(village)
      },
      onDelete: (village: Village) => {
        setDeletingVillage(village)
      },
    },
  })

  return {
    table,
    editingVillage,
    setEditingVillage,
    deletingVillage,
    setDeletingVillage,
  }
}
