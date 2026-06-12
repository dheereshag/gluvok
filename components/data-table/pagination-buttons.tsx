import * as React from "react"
import { type Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DataTablePaginationButtons<TData>({ table }: { table: Table<TData> }) {
  const buttons = [
    { label: "first", icon: ChevronsLeft, onClick: () => table.setPageIndex(0), disabled: !table.getCanPreviousPage() },
    { label: "previous", icon: ChevronLeft, onClick: () => table.previousPage(), disabled: !table.getCanPreviousPage() },
    { label: "next", icon: ChevronRight, onClick: () => table.nextPage(), disabled: !table.getCanNextPage() },
    { label: "last", icon: ChevronsRight, onClick: () => table.setPageIndex(table.getPageCount() - 1), disabled: !table.getCanNextPage() },
  ]

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center text-xs font-medium min-w-[70px]">
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
      </div>
      <div className="flex items-center space-x-1">
        {buttons.map((btn, idx) => {
          const Icon = btn.icon
          return (
            <Button
              key={idx}
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={btn.onClick}
              disabled={btn.disabled}
            >
              <span className="sr-only">Go to {btn.label} page</span>
              <Icon className="h-4 w-4" />
            </Button>
          )
        })}
      </div>
    </div>
  )
}
