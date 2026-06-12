import { type Table } from "@tanstack/react-table"
import { CheckSquare } from "lucide-react"

export function DataTablePaginationRowsCount<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className="text-xs text-muted-foreground flex items-center gap-1.5 justify-center sm:justify-start">
      <CheckSquare className="h-4 w-4 text-primary" />
      <span>
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </span>
    </div>
  )
}
