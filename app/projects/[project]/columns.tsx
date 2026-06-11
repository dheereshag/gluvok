"use client"

import * as React from "react"
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
import { ProjectSlug } from "@/lib/fields"
import { STATES } from "@/data/states"

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
  if (projectSlug === ProjectSlug.CENTERS) {
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
  } else if (projectSlug === ProjectSlug.COMMODITIES) {
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
                <IndianRupee className="h-3.5 w-3.5 text-muted-foreground/70" />
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
  } else if (projectSlug === ProjectSlug.CUSTOMERS) {
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
  } else if (projectSlug === ProjectSlug.DATA_ENTRIES) {
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
  } else if (projectSlug === ProjectSlug.FACTORIES) {
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
  } else if (projectSlug === ProjectSlug.OPERATORS) {
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
  } else if (projectSlug === ProjectSlug.USERS) {
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
  } else if (projectSlug === ProjectSlug.VILLAGES) {
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
        cell: ({ row }) => {
          const stateValue = String(row.getValue("state"))
          const stateObj = STATES.find((s) => s.value === stateValue)
          const stateLabel = stateObj ? stateObj.label : stateValue
          
          return (
            <Pill variant="outline" className="font-bold text-xs text-muted-foreground py-0.5 px-2">
              <PillIcon icon={Globe} />
              {stateLabel}
            </Pill>
          )
        },
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

  if (projectSlug !== ProjectSlug.DATA_ENTRIES) {
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
