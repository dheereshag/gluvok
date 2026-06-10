"use client"

import * as React from "react"
import { ColumnDef, flexRender } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/data-table-pagination"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { Search, SearchX, Loader2 } from "lucide-react"

import { Village } from "@/data/villages"
import { VillagesStoreInitializer, useVillagesStore } from "./store"
import { useVillagesTable } from "./hooks/use-villages-table"
import { EditVillageDialog } from "./edit-village-dialog"
import { DeleteVillageDialog } from "./delete-village-dialog"


interface DataTableProps<TValue> {
  columns: ColumnDef<Village, TValue>[]
  initialData: Village[]
}

export function DataTable<TValue>({
  columns,
  initialData,
}: DataTableProps<TValue>) {
  const {
    table,
    editingVillage,
    setEditingVillage,
    deletingVillage,
    setDeletingVillage,
  } = useVillagesTable({ columns })

  const isLoading = useVillagesStore((state) => state.isLoading)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Hydrate/seed store with server-loaded data */}
        <VillagesStoreInitializer initialVillages={initialData} />

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-xs font-semibold text-muted-foreground/80">Loading villages...</span>
        </div>
      </div>
    )
  }

  const nameColumn = table.getColumn("name")

  return (
    <div className="space-y-4">
      {/* Hydrate/seed store with server-loaded data */}
      <VillagesStoreInitializer initialVillages={initialData} />

      <div className="flex items-center justify-between gap-4">
        {nameColumn && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="villages-search-input"
              placeholder="Filter villages by name..."
              value={(nameColumn.getFilterValue() as string) ?? ""}
              onChange={(event) => nameColumn.setFilterValue(event.target.value)}
              className="pl-9 pr-4 h-9 text-xs bg-background border border-input focus-visible:ring-1 focus-visible:ring-primary/50 transition-shadow"
            />
          </div>
        )}
        <DataTableViewOptions table={table} />
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-300">
        <Table>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-10 text-xs py-2 font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/10 transition-colors duration-150 border-b last:border-b-0 data-[state=selected]:bg-muted/20"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 text-xs">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-xs text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <SearchX className="h-8 w-8 text-muted-foreground/40 animate-pulse" />
                    <span className="font-medium">No results found.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="pt-2">
        <DataTablePagination table={table} />
      </div>

      <EditVillageDialog
        open={editingVillage !== null}
        onOpenChange={(open) => {
          if (!open) setEditingVillage(null)
        }}
        village={editingVillage}
      />

      <DeleteVillageDialog
        open={deletingVillage !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingVillage(null)
        }}
        village={deletingVillage}
      />
    </div>
  )
}
