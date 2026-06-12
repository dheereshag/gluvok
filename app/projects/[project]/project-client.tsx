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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/data-table"
import { SearchX } from "lucide-react"

import { useEntitiesStore } from "@/lib/store"
import { getPrimaryIdKey, ProjectSlug, EntityKey } from "@/lib/fields"
import { Spinner } from "@/components/kibo-ui/spinner"

import { ProjectToolbar } from "@/components/projects/project-toolbar"
import { ProjectDialogs } from "@/components/projects/project-dialogs"
import { getProjectColumns } from "@/components/projects/columns"

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
    if (projectSlug === ProjectSlug.USERS) return EntityKey.EMAIL
    if (projectSlug === ProjectSlug.DATA_ENTRIES) return EntityKey.VEHICLE_NUMBER
    return EntityKey.NAME
  }, [projectSlug])


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
      <ProjectToolbar
        table={table}
        projectSlug={projectSlug}
        projectName={projectName}
        filterKey={filterKey}
        setCreating={setCreating}
      />

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

      <ProjectDialogs
        creating={creating}
        setCreating={setCreating}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        deletingItem={deletingItem}
        setDeletingItem={setDeletingItem}
        projectSlug={projectSlug}
        projectName={projectName}
        primaryIdKey={primaryIdKey}
      />
    </div>
  )
}
