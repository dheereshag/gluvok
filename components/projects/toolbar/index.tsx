import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, RotateCw } from "lucide-react"
import { DataTableViewOptions } from "@/components/data-table"
import { BulkActions } from "./bulk-actions"

import { useAuthStore, getPermissions } from "@/lib/store"

interface ProjectToolbarProps<TData> {
  table: Table<TData>; projectSlug: string; projectName: string; filterKey: string
  primaryIdKey: string; setCreating: (open: boolean) => void; onReload: () => void
}

export function ProjectToolbar<TData>({
  table, projectSlug, projectName, filterKey, primaryIdKey, setCreating, onReload
}: ProjectToolbarProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const user = useAuthStore((state) => state.user)
  const permissions = getPermissions(user?.role, projectSlug)
  const canWrite = permissions.write

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {selectedRows.length > 0 ? (
        <BulkActions
          table={table}
          projectSlug={projectSlug}
          projectName={projectName}
          primaryIdKey={primaryIdKey}
        />
      ) : (
        <>
          <div className="relative w-full sm:max-w-xs md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id={`search-input-${projectSlug}`}
              placeholder={
                projectSlug === "assignments"
                  ? "Search by email or factory..."
                  : projectSlug === "profiles"
                  ? "Search by name, email or factory..."
                  : projectSlug === "centers"
                  ? "Search by name or factory..."
                  : projectSlug === "rates"
                  ? "Search by commodity or factory..."
                  : projectSlug === "customers"
                  ? "Search by name, email, village or govt id..."
                  : projectSlug === "factories"
                  ? "Search by name or village..."
                  : projectSlug === "users"
                  ? "Search by email or role..."
                  : `Search by ${filterKey.replace("_", " ")}...`
              }
              value={(table.getState().globalFilter as string) ?? ""}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="pl-9 pr-4 h-9 text-xs bg-background border border-input focus-visible:ring-1 focus-visible:ring-primary/50 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="outline"
              size="icon"
              onClick={onReload}
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 shadow-sm"
              title="Reload and Reset Data"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            {canWrite && (
              <Button onClick={() => setCreating(true)} size="sm" className="h-9 gap-1.5 shadow-sm">
                <Plus className="h-4 w-4" />
                Add {projectName}
              </Button>
            )}
            <DataTableViewOptions table={table} />
          </div>
        </>
      )}
    </div>
  )
}
