"use client"

import * as React from "react"
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
import { DataTablePagination } from "@/components/data-table-pagination"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  SearchX,
  MoreHorizontal,
  Copy,
  Pencil,
  Trash2,
  Hash,
  Calendar,
  CalendarClock,
  Home,
  User,
  Users,
  Mail,
  Car,
  Weight,
  DollarSign,
  Building,
  ShieldCheck,
  Globe,
  Package,
} from "lucide-react"
import { toast } from "sonner"

import { useEntitiesStore } from "@/lib/store"
import { Spinner } from "@/components/kibo-ui/spinner"
import { Pill, PillIcon, PillIndicator } from "@/components/kibo-ui/pill"
import { EditEntityDialog } from "./edit-dialog"
import { DeleteEntityDialog } from "./delete-dialog"

interface ProjectClientProps {
  projectName: string
  projectSlug: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: any[]
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return "-"
  try {
    const date = new Date(dateStr.replace(" ", "T"))
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    }
  } catch {}
  return dateStr
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingItem, setEditingItem] = React.useState<any | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deletingItem, setDeletingItem] = React.useState<any | null>(null)

  const getPrimaryIdKey = React.useCallback(() => {
    if (projectSlug === "customers") return "govt_id"
    if (projectSlug === "operators") return "aadhar_number"
    return "id"
  }, [projectSlug])

  const primaryIdKey = getPrimaryIdKey()

  // Generate columns dynamically based on the project type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = React.useMemo<ColumnDef<any>[]>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cols: ColumnDef<any>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ]

    // Primary Identifier Column
    cols.push({
      accessorKey: primaryIdKey,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={
            <span className="flex items-center gap-1">
              {primaryIdKey === "govt_id" || primaryIdKey === "aadhar_number" ? (
                <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground/70" />
              ) : (
                <Hash className="h-3.5 w-3.5 text-muted-foreground/70" />
              )}
              {primaryIdKey === "govt_id"
                ? "Govt ID"
                : primaryIdKey === "aadhar_number"
                ? "Aadhar Number"
                : "ID"}
            </span>
          }
        />
      ),
      cell: ({ row }) => (
        <div className="font-mono text-muted-foreground text-xs">
          {String(row.getValue(primaryIdKey))}
        </div>
      ),
    })

    // Conditional columns depending on entity type
    if (projectSlug === "centers") {
      cols.push(
        {
          accessorKey: "name",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Name
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{String(row.getValue("name"))}</div>,
        },
        {
          accessorKey: "factory_id",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Factory ID
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-mono text-muted-foreground text-xs">{String(row.getValue("factory_id"))}</div>,
        }
      )
    } else if (projectSlug === "commodities") {
      cols.push(
        {
          accessorKey: "name",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Name
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{String(row.getValue("name"))}</div>,
        },
        {
          accessorKey: "unit_price",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Unit Price
                </span>
              }
            />
          ),
          cell: ({ row }) => {
            const price = parseFloat(String(row.getValue("unit_price")))
            const formatted = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(price)
            return <div className="font-medium text-xs text-emerald-600 dark:text-emerald-500 font-mono">{formatted}</div>
          },
        }
      )
    } else if (projectSlug === "customers") {
      cols.push(
        {
          accessorKey: "name",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Name
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{String(row.getValue("name"))}</div>,
        },
        {
          accessorKey: "father_name",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Father&apos;s Name
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="text-muted-foreground text-xs">{String(row.getValue("father_name"))}</div>,
        },
        {
          accessorKey: "village_id",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Village ID
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-mono text-muted-foreground text-xs">{String(row.getValue("village_id"))}</div>,
        }
      )
    } else if (projectSlug === "data-entries") {
      cols.push(
        {
          accessorKey: "vehicle_number",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Car className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Vehicle Number
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{String(row.getValue("vehicle_number"))}</div>,
        },
        {
          accessorKey: "weight",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Weight className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Weight
                </span>
              }
            />
          ),
          cell: ({ row }) => (
            <Pill variant="secondary" className="font-mono text-xs font-semibold py-0.5 px-2 bg-muted/60 border border-muted-foreground/10">
              <PillIcon icon={Weight} />
              {String(row.getValue("weight"))} tons
            </Pill>
          ),
        },
        {
          accessorKey: "commodity_id",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Package className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Commodity
                </span>
              }
            />
          ),
          cell: ({ row }) => (
            <Pill variant="secondary" className="font-mono text-[10px] py-0.5 px-2 bg-muted/60 border border-muted-foreground/10">
              <PillIcon icon={Package} />
              ID: {String(row.getValue("commodity_id"))}
            </Pill>
          ),
        },
        {
          accessorKey: "center_id",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Center
                </span>
              }
            />
          ),
          cell: ({ row }) => (
            <Pill variant="outline" className="font-mono text-[10px] py-0.5 px-2">
              <PillIcon icon={Building} />
              ID: {String(row.getValue("center_id"))}
            </Pill>
          ),
        },
        {
          accessorKey: "operator_id",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Operator
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-mono text-muted-foreground text-xs">{String(row.getValue("operator_id"))}</div>,
        },
        {
          accessorKey: "customer_id",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Customer
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-mono text-muted-foreground text-xs">{String(row.getValue("customer_id"))}</div>,
        }
      )
    } else if (projectSlug === "factories") {
      cols.push(
        {
          accessorKey: "name",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Name
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{String(row.getValue("name"))}</div>,
        },
        {
          accessorKey: "village_id",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Village ID
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-mono text-muted-foreground text-xs">{String(row.getValue("village_id"))}</div>,
        }
      )
    } else if (projectSlug === "operators") {
      cols.push(
        {
          accessorKey: "id",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground/70" />
                  System ID
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-mono text-muted-foreground text-xs">{String(row.getValue("id"))}</div>,
        },
        {
          accessorKey: "name",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Name
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{String(row.getValue("name"))}</div>,
        }
      )
    } else if (projectSlug === "users") {
      cols.push(
        {
          accessorKey: "email",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Email
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{String(row.getValue("email"))}</div>,
        },
        {
          accessorKey: "role",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Role
                </span>
              }
            />
          ),
          cell: ({ row }) => (
            <Pill variant="secondary" className="text-[10px] uppercase font-bold tracking-wider py-0.5 px-2 bg-muted/60 border border-muted-foreground/10">
              <PillIndicator pulse variant="success" />
              {String(row.getValue("role"))}
            </Pill>
          ),
        }
      )
    } else if (projectSlug === "villages") {
      cols.push(
        {
          accessorKey: "name",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5 text-muted-foreground/70" />
                  Name
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{String(row.getValue("name"))}</div>,
        },
        {
          accessorKey: "state",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground/70" />
                  State
                </span>
              }
            />
          ),
          cell: ({ row }) => (
            <Pill variant="outline" className="font-bold text-xs text-muted-foreground py-0.5 px-2">
              <PillIcon icon={Globe} />
              {String(row.getValue("state"))}
            </Pill>
          ),
        }
      )
    }

    // Timestamps
    cols.push(
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                Created At
              </span>
            }
          />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs font-medium">
            {formatDateTime(String(row.getValue("created_at")))}
          </span>
        ),
      }
    )

    if (projectSlug !== "data-entries") {
      cols.push({
        accessorKey: "updated_at",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={
              <span className="flex items-center gap-1">
                <CalendarClock className="h-3.5 w-3.5 text-muted-foreground/70" />
                Updated At
              </span>
            }
          />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs font-medium">
            {formatDateTime(String(row.getValue("updated_at")))}
          </span>
        ),
      })
    }

    // Actions dropdown column
    cols.push({
      id: "actions",
      cell: ({ row }) => {
        const item = row.original
        const itemId = String(item[primaryIdKey])

        return (
          <div className="text-right pr-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  id={`actions-trigger-${projectSlug}-${itemId}`}
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuItem
                  id={`actions-copy-${projectSlug}-${itemId}`}
                  className="text-xs cursor-pointer gap-2 py-2"
                  onClick={() => {
                    navigator.clipboard.writeText(itemId)
                    toast.success("Identifier copied to clipboard")
                  }}
                >
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  Copy ID
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  id={`actions-edit-${projectSlug}-${itemId}`}
                  className="text-xs cursor-pointer gap-2 py-2"
                  onClick={() => setEditingItem(item)}
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  Edit {projectName}
                </DropdownMenuItem>
                <DropdownMenuItem
                  id={`actions-delete-${projectSlug}-${itemId}`}
                  className="text-xs cursor-pointer gap-2 py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={() => setDeletingItem(item)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  Delete {projectName}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    })

    return cols
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
      <div className="flex items-center justify-between gap-4">
        {filterColumn && (
          <div className="relative flex-1 max-w-sm">
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
        <DataTableViewOptions table={table} />
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

      <EditEntityDialog
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
