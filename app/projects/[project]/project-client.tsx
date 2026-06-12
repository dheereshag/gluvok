"use client"

import * as React from "react"
import { type EntityRecord } from "@/types"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  TableOptions,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination, DataTableViewOptions } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Search, SearchX, Plus } from "lucide-react"

import { useEntitiesStore } from "@/lib/store"
import { getPrimaryIdKey } from "@/lib/fields"
import { Spinner } from "@/components/kibo-ui/spinner"
import { EntityDialog } from "./entity-dialog"
import { DeleteEntityDialog } from "./delete-dialog"
import { getProjectColumns } from "./columns"

interface ProjectClientProps {
  projectName: string
  projectSlug: string
  initialData: EntityRecord[]
}

function useCompilerSafeTable<TData>(options: TableOptions<TData>) {
  "use no memo"
  // eslint-disable-next-line react-hooks/incompatible-library
  return useReactTable(options)
}

export function ProjectClient({
  projectName,
  projectSlug,
  initialData,
}: ProjectClientProps) {
  // Bind list state to the generic Zustand store
  const storeData = useEntitiesStore((state) => state.entities[projectSlug])
  const setEntities = useEntitiesStore((state) => state.setEntities)

  const [prevSlug, setPrevSlug] = React.useState(projectSlug)
  const [localLoading, setLocalLoading] = React.useState(true)

  if (projectSlug !== prevSlug) {
    setPrevSlug(projectSlug)
    setLocalLoading(true)
  }

  React.useEffect(() => {
    // Seed store if empty
    if (storeData === undefined) {
      setEntities(projectSlug, initialData)
    }
    // Simulate loading transition
    const timer = setTimeout(() => {
      setLocalLoading(false)
    }, 600)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectSlug, initialData, setEntities]) // Exclude storeData to avoid re-triggering loader on updates

  const tableData = storeData || initialData
  const isLoading = localLoading

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [editingItem, setEditingItem] = React.useState<EntityRecord | null>(null)
  const [deletingItem, setDeletingItem] = React.useState<EntityRecord | null>(null)
  const [creating, setCreating] = React.useState(false)

  const primaryIdKey = getPrimaryIdKey(projectSlug)

  // Generate columns dynamically based on the project type
  const columns = React.useMemo<ColumnDef<EntityRecord>[]>(() => {
    return getProjectColumns(projectSlug, primaryIdKey, projectName, {
      onEdit: setEditingItem,
      onDelete: setDeletingItem,
    })
  }, [projectSlug, primaryIdKey, projectName])

  const table = useCompilerSafeTable({
    data: tableData,
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
  })

  // Filter input key determination
  const filterKey = React.useMemo(() => {
    if (projectSlug === "users") return "email"
    if (projectSlug === "data-entries") return "vehicle_number"
    return "name"
  }, [projectSlug])

  const filterColumn = table.getColumn(filterKey)

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
    <div className="space-y-4">
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

      <EntityDialog
        mode="create"
        open={creating}
        onOpenChange={setCreating}
        projectSlug={projectSlug}
        projectName={projectName}
        primaryIdKey={primaryIdKey}
      />

      <EntityDialog
        mode="edit"
        open={editingItem !== null}
        onOpenChange={(open) => {
          if (!open) setEditingItem(null)
        }}
        projectSlug={projectSlug}
        projectName={projectName}
        primaryIdKey={primaryIdKey}
        item={editingItem}
      />

      <DeleteEntityDialog
        open={deletingItem !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingItem(null)
        }}
        projectSlug={projectSlug}
        projectName={projectName}
        primaryIdKey={primaryIdKey}
        item={deletingItem}
      />
    </div>
  )
}
