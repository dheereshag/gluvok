import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import { DataTableViewOptions } from "@/components/data-table"

interface ProjectToolbarProps<TData> {
  table: Table<TData>
  projectSlug: string
  projectName: string
  filterKey: string
  setCreating: (open: boolean) => void
}

export function ProjectToolbar<TData>({
  table,
  projectSlug,
  projectName,
  filterKey,
  setCreating,
}: ProjectToolbarProps<TData>) {
  const filterColumn = table.getColumn(filterKey)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {filterColumn && (
        <div className="relative w-full sm:max-w-xs md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id={`search-input-${projectSlug}`}
            placeholder={`Filter by ${filterKey.replace("_", " ")}...`}
            value={(filterColumn.getFilterValue() as string) ?? ""}
            onChange={(event) => filterColumn.setFilterValue(event.target.value)}
            className="pl-9 pr-4 h-9 text-xs bg-background border border-input focus-visible:ring-1 focus-visible:ring-primary/50 transition-shadow"
          />
        </div>
      )}
      <div className="flex items-center gap-2 justify-end">
        <Button onClick={() => setCreating(true)} size="sm" className="h-9 gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          Add {projectName}
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
