import { type Table } from "@tanstack/react-table"
import { DataTablePaginationRowsCount } from "./pagination-rows-count"
import { DataTablePaginationPageSize } from "./pagination-page-size"
import { DataTablePaginationButtons } from "./pagination-buttons"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-2 py-1">
      <DataTablePaginationRowsCount table={table} />
      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 lg:gap-8">
        <DataTablePaginationPageSize table={table} />
        <DataTablePaginationButtons table={table} />
      </div>
    </div>
  )
}
