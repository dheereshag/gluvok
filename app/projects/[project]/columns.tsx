"use client"

import { ColumnDef } from "@tanstack/react-table"
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
  Building,
  ShieldCheck,
  Globe,
  Package,
  IndianRupee,
} from "lucide-react"
import { toast } from "sonner"
import { Pill, PillIcon, PillIndicator } from "@/components/kibo-ui/pill"
import { ProjectSlug, EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"

interface ColumnActionsCallbacks<T = Record<string, unknown>> {
  onEdit: (item: T) => void
  onDelete: (item: T) => void
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

export function getProjectColumns<T extends Record<string, unknown> = Record<string, unknown>>(
  projectSlug: string,
  primaryIdKey: string,
  projectName: string,
  callbacks: ColumnActionsCallbacks<T>
): ColumnDef<T>[] {
  const cols: ColumnDef<T>[] = [
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
            {primaryIdKey === EntityKey.GOVT_ID || primaryIdKey === EntityKey.AADHAR_NUMBER ? (
              <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground/70" />
            ) : (
              <Hash className="h-3.5 w-3.5 text-muted-foreground/70" />
            )}
            {primaryIdKey === EntityKey.GOVT_ID
              ? ColumnLabel.GOVT_ID
              : primaryIdKey === EntityKey.AADHAR_NUMBER
              ? ColumnLabel.AADHAR_NUMBER
              : ColumnLabel.ID}
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
  switch (projectSlug) {
    case ProjectSlug.CENTERS:
      cols.push(
        {
          accessorKey: EntityKey.NAME,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.NAME}
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{String(row.getValue(EntityKey.NAME))}</div>,
        },
        {
          accessorKey: EntityKey.FACTORY_ID,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.FACTORY_ID}
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-mono text-muted-foreground text-xs">{String(row.getValue(EntityKey.FACTORY_ID))}</div>,
        }
      )
      break

    case ProjectSlug.COMMODITIES:
      cols.push(
        {
          accessorKey: EntityKey.NAME,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.NAME}
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{String(row.getValue(EntityKey.NAME))}</div>,
        },
        {
          accessorKey: EntityKey.UNIT_PRICE,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.UNIT_PRICE}
                </span>
              }
            />
          ),
          cell: ({ row }) => {
            const price = parseFloat(String(row.getValue(EntityKey.UNIT_PRICE)))
            const formatted = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(price)
            return <div className="font-medium text-xs text-emerald-600 dark:text-emerald-500 font-mono">{formatted}</div>
          },
        }
      )
      break

    case ProjectSlug.CUSTOMERS:
      cols.push(
        {
          accessorKey: EntityKey.NAME,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.NAME}
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{String(row.getValue(EntityKey.NAME))}</div>,
        },
        {
          accessorKey: EntityKey.FATHER_NAME,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.FATHER_NAME}
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="text-muted-foreground text-xs">{String(row.getValue(EntityKey.FATHER_NAME))}</div>,
        },
        {
          accessorKey: EntityKey.VILLAGE_ID,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.VILLAGE_ID}
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-mono text-muted-foreground text-xs">{String(row.getValue(EntityKey.VILLAGE_ID))}</div>,
        }
      )
      break

    case ProjectSlug.DATA_ENTRIES:
      cols.push(
        {
          accessorKey: EntityKey.VEHICLE_NUMBER,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Car className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.VEHICLE_NUMBER}
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{String(row.getValue(EntityKey.VEHICLE_NUMBER))}</div>,
        },
        {
          accessorKey: EntityKey.WEIGHT,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Weight className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.WEIGHT}
                </span>
              }
            />
          ),
          cell: ({ row }) => (
            <Pill variant="secondary" className="font-mono text-xs font-semibold py-0.5 px-2 bg-muted/60 border border-muted-foreground/10">
              <PillIcon icon={Weight} />
              {String(row.getValue(EntityKey.WEIGHT))} tons
            </Pill>
          ),
        },
        {
          accessorKey: EntityKey.COMMODITY_ID,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Package className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.COMMODITY_ID}
                </span>
              }
            />
          ),
          cell: ({ row }) => (
            <Pill variant="secondary" className="font-mono text-[10px] py-0.5 px-2 bg-muted/60 border border-muted-foreground/10">
              <PillIcon icon={Package} />
              ID: {String(row.getValue(EntityKey.COMMODITY_ID))}
            </Pill>
          ),
        },
        {
          accessorKey: EntityKey.CENTER_ID,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.CENTER_ID}
                </span>
              }
            />
          ),
          cell: ({ row }) => (
            <Pill variant="outline" className="font-mono text-[10px] py-0.5 px-2">
              <PillIcon icon={Building} />
              ID: {String(row.getValue(EntityKey.CENTER_ID))}
            </Pill>
          ),
        },
        {
          accessorKey: EntityKey.OPERATOR_ID,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.OPERATOR_ID}
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-mono text-muted-foreground text-xs">{String(row.getValue(EntityKey.OPERATOR_ID))}</div>,
        },
        {
          accessorKey: EntityKey.CUSTOMER_ID,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.CUSTOMER_ID}
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-mono text-muted-foreground text-xs">{String(row.getValue(EntityKey.CUSTOMER_ID))}</div>,
        }
      )
      break

    case ProjectSlug.FACTORIES:
      cols.push(
        {
          accessorKey: EntityKey.NAME,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.NAME}
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{String(row.getValue(EntityKey.NAME))}</div>,
        },
        {
          accessorKey: EntityKey.VILLAGE_ID,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.VILLAGE_ID}
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-mono text-muted-foreground text-xs">{String(row.getValue(EntityKey.VILLAGE_ID))}</div>,
        }
      )
      break

    case ProjectSlug.OPERATORS:
      cols.push(
        {
          accessorKey: EntityKey.ID,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.ID}
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-mono text-muted-foreground text-xs">{String(row.getValue(EntityKey.ID))}</div>,
        },
        {
          accessorKey: EntityKey.NAME,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.NAME}
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{String(row.getValue(EntityKey.NAME))}</div>,
        }
      )
      break

    case ProjectSlug.USERS:
      cols.push(
        {
          accessorKey: EntityKey.EMAIL,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.EMAIL}
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{String(row.getValue(EntityKey.EMAIL))}</div>,
        },
        {
          accessorKey: EntityKey.ROLE,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.ROLE}
                </span>
              }
            />
          ),
          cell: ({ row }) => (
            <Pill variant="secondary" className="text-[10px] uppercase font-bold tracking-wider py-0.5 px-2 bg-muted/60 border border-muted-foreground/10">
              <PillIndicator pulse variant="success" />
              {String(row.getValue(EntityKey.ROLE))}
            </Pill>
          ),
        }
      )
      break

    case ProjectSlug.VILLAGES:
      cols.push(
        {
          accessorKey: EntityKey.NAME,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.NAME}
                </span>
              }
            />
          ),
          cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{String(row.getValue(EntityKey.NAME))}</div>,
        },
        {
          accessorKey: EntityKey.STATE,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {ColumnLabel.STATE}
                </span>
              }
            />
          ),
          cell: ({ row }) => {
            const stateValue = String(row.getValue(EntityKey.STATE))
            return (
              <Pill variant="outline" className="font-bold text-xs text-muted-foreground py-0.5 px-2">
                <PillIcon icon={Globe} />
                {stateValue}
              </Pill>
            )
          },
        }
      )
      break
  }

  // Timestamps
  cols.push(
    {
      accessorKey: EntityKey.CREATED_AT,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
              {ColumnLabel.CREATED_AT}
            </span>
          }
        />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs font-medium">
          {formatDateTime(String(row.getValue(EntityKey.CREATED_AT)))}
        </span>
      ),
    }
  )

  if (projectSlug !== ProjectSlug.DATA_ENTRIES) {
    cols.push({
      accessorKey: EntityKey.UPDATED_AT,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={
            <span className="flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5 text-muted-foreground/70" />
              {ColumnLabel.UPDATED_AT}
            </span>
          }
        />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs font-medium">
          {formatDateTime(String(row.getValue(EntityKey.UPDATED_AT)))}
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
          <DropdownMenu modal={false}>
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
                onClick={() => callbacks.onEdit(item)}
              >
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                Edit {projectName}
              </DropdownMenuItem>
              <DropdownMenuItem
                id={`actions-delete-${projectSlug}-${itemId}`}
                className="text-xs cursor-pointer gap-2 py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={() => callbacks.onDelete(item)}
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
}
