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

import { useForm, useWatch } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import * as z from "zod"
import { ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Village } from "@/data/villages"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onDataChange?: React.Dispatch<React.SetStateAction<TData[]>>
}

function useCompilerSafeTable<TData>(options: TableOptions<TData>) {
  "use no memo"
  // eslint-disable-next-line react-hooks/incompatible-library
  return useReactTable(options)
}

const STATES = [
  { value: "PB", label: "Punjab" },
  { value: "RJ", label: "Rajasthan" },
  { value: "HR", label: "Haryana" },
  { value: "DL", label: "Delhi" },
  { value: "UP", label: "Uttar Pradesh" },
  { value: "MH", label: "Maharashtra" },
  { value: "KA", label: "Karnataka" },
  { value: "TN", label: "Tamil Nadu" },
  { value: "GJ", label: "Gujarat" },
] as const

const editSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  state: z.string().min(1, "State is required"),
})

type EditFormValues = z.infer<typeof editSchema>

export function DataTable<TData, TValue>({
  columns,
  data,
  onDataChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [editingVillage, setEditingVillage] = React.useState<Village | null>(null)
  const [deletingVillage, setDeletingVillage] = React.useState<Village | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  const form = useForm<EditFormValues>({
    resolver: standardSchemaResolver(editSchema),
    defaultValues: {
      name: "",
      state: "",
    },
  })

  const selectedState = useWatch({
    control: form.control,
    name: "state",
  })

  React.useEffect(() => {
    if (editingVillage) {
      form.reset({
        name: editingVillage.name,
        state: editingVillage.state,
      })
    }
  }, [editingVillage, form])

  const onEditSubmit = (values: EditFormValues) => {
    if (!editingVillage || !onDataChange) return
    onDataChange((prev) =>
      (prev as Village[]).map((item) =>
        item.id === editingVillage.id
          ? {
              ...item,
              name: values.name,
              state: values.state,
              updated_at: new Date().toISOString().replace("T", " ").substring(0, 26),
            }
          : item
      ) as unknown as TData[]
    )
    setEditingVillage(null)
  }

  const onDeleteConfirm = () => {
    if (!deletingVillage || !onDataChange) return
    onDataChange((prev) =>
      (prev as Village[]).filter((item) => item.id !== deletingVillage.id) as unknown as TData[]
    )
    setDeletingVillage(null)
  }

  const table = useCompilerSafeTable({
    data,
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
    meta: {
      onEdit: (village: Village) => {
        setEditingVillage(village)
      },
      onDelete: (village: Village) => {
        setDeletingVillage(village)
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter villages by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm h-9 text-xs focus-visible:ring-1 focus-visible:ring-primary/50"
        />
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-300">
        <Table>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-10 text-xs py-2 font-medium">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/20 transition-colors duration-200 border-b last:border-b-0 data-[state=selected]:bg-muted/30"
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
                  className="h-24 text-center text-xs text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="pt-2">
        <DataTablePagination table={table} />
      </div>

      {/* Edit Dialog */}
      <Dialog open={editingVillage !== null} onOpenChange={(open) => {
        if (!open) setEditingVillage(null)
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Village</DialogTitle>
            <DialogDescription>
              Update the name or state of the village. Click save when done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-semibold text-muted-foreground">
                Village Name
              </label>
              <Input
                id="name"
                {...form.register("name")}
                className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-primary/50"
              />
              {form.formState.errors.name && (
                <span className="text-destructive text-[11px]">
                  {form.formState.errors.name.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground">
                State
              </label>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isPopoverOpen}
                    className="h-9 w-full justify-between text-xs font-normal"
                  >
                    {selectedState
                      ? STATES.find((state) => state.value === selectedState)?.label || selectedState
                      : "Select state..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[370px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search state..." className="h-8" />
                    <CommandList>
                      <CommandEmpty>No state found.</CommandEmpty>
                      <CommandGroup>
                        {STATES.map((state) => (
                          <CommandItem
                            key={state.value}
                            value={state.value}
                            onSelect={() => {
                              form.setValue("state", state.value)
                              setIsPopoverOpen(false)
                            }}
                          >
                            {state.label} ({state.value})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {form.formState.errors.state && (
                <span className="text-destructive text-[11px]">
                  {form.formState.errors.state.message}
                </span>
              )}
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingVillage(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deletingVillage !== null} onOpenChange={(open) => {
        if (!open) setDeletingVillage(null)
      }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Village</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold text-foreground">{deletingVillage?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingVillage(null)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={onDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
