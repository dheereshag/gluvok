import { Table, flexRender } from "@tanstack/react-table"
import { Table as TableGrid, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProjectTableLoading } from "./loading"
import { ProjectTableEmpty } from "./empty"

interface ProjectTableProps<TData> {
  table: Table<TData>
  isLoading: boolean
  columnsCount: number
}

export function ProjectTable<TData>({ table, isLoading, columnsCount }: ProjectTableProps<TData>) {
  if (isLoading) return <ProjectTableLoading />

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-300">
      <TableGrid>
        <TableHeader className="bg-muted/30">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent border-b">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="h-10 text-xs py-2 font-semibold">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                className="hover:bg-muted/10 transition-colors duration-150 border-b last:border-b-0"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3 text-xs">
                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <ProjectTableEmpty columnsCount={columnsCount} />
          )}
        </TableBody>
      </TableGrid>
    </div>
  )
}
