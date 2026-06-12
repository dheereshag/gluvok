import { type Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckSquare,
  List
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-2 py-1">
      <div className="text-xs text-muted-foreground flex items-center gap-1.5 justify-center sm:justify-start">
        <CheckSquare className="h-4 w-4 text-primary" />
        <span>
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <List className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px] text-xs">
              <SelectValue placeholder={`${table.getState().pagination.pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                <SelectLabel className="text-xs">Small Rows</SelectLabel>
                {[5, 10, 20].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`} className="text-xs">
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel className="text-xs">Large Rows</SelectLabel>
                {[30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`} className="text-xs">
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center text-xs font-medium min-w-[70px]">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </div>
          <div className="flex items-center space-x-1">
            {[
              {
                label: "first",
                icon: ChevronsLeft,
                onClick: () => table.setPageIndex(0),
                disabled: !table.getCanPreviousPage(),
              },
              {
                label: "previous",
                icon: ChevronLeft,
                onClick: () => table.previousPage(),
                disabled: !table.getCanPreviousPage(),
              },
              {
                label: "next",
                icon: ChevronRight,
                onClick: () => table.nextPage(),
                disabled: !table.getCanNextPage(),
              },
              {
                label: "last",
                icon: ChevronsRight,
                onClick: () => table.setPageIndex(table.getPageCount() - 1),
                disabled: !table.getCanNextPage(),
              },
            ].map((btn, idx) => {
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
      </div>
    </div>
  )
}
