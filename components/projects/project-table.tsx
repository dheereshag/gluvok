import * as React from "react"
import { Table, flexRender } from "@tanstack/react-table"
import { SearchX } from "lucide-react"
import { Spinner } from "@/components/kibo-ui/spinner"
import {
  Table as TableGrid,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ProjectTableProps<TData> {
  table: Table<TData>
  isLoading: boolean
  columnsCount: number
}

export function ProjectTable<TData>({
  table,
  isLoading,
  columnsCount,
}: ProjectTableProps<TData>) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm h-64 flex flex-col items-center justify-center gap-3">
          <Spinner variant="circle-filled" className="size-6 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground/80">
            Loading data...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-300">
      <TableGrid>
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
                colSpan={columnsCount}
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
      </TableGrid>
    </div>
  )
}
