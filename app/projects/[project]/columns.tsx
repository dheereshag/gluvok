"use client"

import { ColumnDef } from "@tanstack/react-table"
import { type EntityRecord } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import { getField } from "@/lib/store"
import { DataTableColumnHeader } from "@/components/data-table"
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
import { formatDateTime } from "@/lib/utils"

interface ColumnActionsCallbacks<T = EntityRecord> {
  onEdit: (item: T) => void
  onDelete: (item: T) => void
}

function createCustomColumn<T>(
  key: EntityKey,
  label: ColumnLabel,
  Icon: React.ComponentType<{ className?: string }>,
  renderCell: (value: string) => React.ReactNode
): ColumnDef<T> {
  return {
    accessorKey: key,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={
          <span className="flex items-center gap-1">
            <Icon className="h-3.5 w-3.5 text-muted-foreground/70" />
            {label}
          </span>
        }
      />
    ),
    cell: ({ row }) => renderCell(String(row.getValue(key))),
  }
}

function createTextColumn<T>(
  key: EntityKey,
  label: ColumnLabel,
  Icon: React.ComponentType<{ className?: string }>,
  className = "font-semibold text-foreground text-xs"
): ColumnDef<T> {
  return createCustomColumn(key, label, Icon, (val) => (
    <div className={className}>{val}</div>
  ))
}

function createPillColumn<T>(
  key: EntityKey,
  label: ColumnLabel,
  Icon: React.ComponentType<{ className?: string }>,
  renderContent: (value: string) => React.ReactNode,
  pillProps?: { variant?: "outline" | "secondary" | "default"; className?: string }
): ColumnDef<T> {
  return createCustomColumn(key, label, Icon, (val) => (
    <Pill variant={pillProps?.variant || "secondary"} className={pillProps?.className}>
      {renderContent(val)}
    </Pill>
  ))
}


export function getProjectColumns<T extends EntityRecord = EntityRecord>(
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
  cols.push(
    createCustomColumn(
      primaryIdKey as EntityKey,
      primaryIdKey === EntityKey.GOVT_ID
        ? ColumnLabel.GOVT_ID
        : primaryIdKey === EntityKey.AADHAR_NUMBER
        ? ColumnLabel.AADHAR_NUMBER
        : ColumnLabel.ID,
      primaryIdKey === EntityKey.GOVT_ID || primaryIdKey === EntityKey.AADHAR_NUMBER
        ? ShieldCheck
        : Hash,
      (val) => <div className="font-mono text-muted-foreground text-xs">{val}</div>
    )
  )

  // Conditional columns depending on entity type
  switch (projectSlug) {
    case ProjectSlug.CENTERS:
      cols.push(
        createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Building),
        createTextColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Building, "font-mono text-muted-foreground text-xs")
      )
      break

    case ProjectSlug.COMMODITIES:
      cols.push(
        createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Building),
        createCustomColumn(EntityKey.UNIT_PRICE, ColumnLabel.UNIT_PRICE, IndianRupee, (val) => {
          const price = parseFloat(val)
          const formatted = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(price)
          return <div className="font-medium text-xs text-emerald-600 dark:text-emerald-500 font-mono">{formatted}</div>
        })
      )
      break

    case ProjectSlug.CUSTOMERS:
      cols.push(
        createTextColumn(EntityKey.NAME, ColumnLabel.NAME, User),
        createTextColumn(EntityKey.FATHER_NAME, ColumnLabel.FATHER_NAME, User, "text-muted-foreground text-xs"),
        createTextColumn(EntityKey.VILLAGE_ID, ColumnLabel.VILLAGE_ID, Home, "font-mono text-muted-foreground text-xs")
      )
      break

    case ProjectSlug.DATA_ENTRIES:
      cols.push(
        createTextColumn(EntityKey.VEHICLE_NUMBER, ColumnLabel.VEHICLE_NUMBER, Car),
        createPillColumn(
          EntityKey.WEIGHT,
          ColumnLabel.WEIGHT,
          Weight,
          (val) => <><PillIcon icon={Weight} />{val} tons</>,
          { className: "font-mono text-xs font-semibold py-0.5 px-2 bg-muted/60 border border-muted-foreground/10" }
        ),
        createPillColumn(
          EntityKey.COMMODITY_ID,
          ColumnLabel.COMMODITY_ID,
          Package,
          (val) => <><PillIcon icon={Package} />ID: {val}</>,
          { className: "font-mono text-[10px] py-0.5 px-2 bg-muted/60 border border-muted-foreground/10" }
        ),
        createPillColumn(
          EntityKey.CENTER_ID,
          ColumnLabel.CENTER_ID,
          Building,
          (val) => <><PillIcon icon={Building} />ID: {val}</>,
          { variant: "outline", className: "font-mono text-[10px] py-0.5 px-2" }
        ),
        createTextColumn(EntityKey.OPERATOR_ID, ColumnLabel.OPERATOR_ID, User, "font-mono text-muted-foreground text-xs"),
        createTextColumn(EntityKey.CUSTOMER_ID, ColumnLabel.CUSTOMER_ID, Users, "font-mono text-muted-foreground text-xs")
      )
      break

    case ProjectSlug.FACTORIES:
      cols.push(
        createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Building),
        createTextColumn(EntityKey.VILLAGE_ID, ColumnLabel.VILLAGE_ID, Home, "font-mono text-muted-foreground text-xs")
      )
      break

    case ProjectSlug.OPERATORS:
      cols.push(
        createTextColumn(EntityKey.ID, ColumnLabel.ID, Hash, "font-mono text-muted-foreground text-xs"),
        createTextColumn(EntityKey.NAME, ColumnLabel.NAME, User)
      )
      break

    case ProjectSlug.USERS:
      cols.push(
        createTextColumn(EntityKey.EMAIL, ColumnLabel.EMAIL, Mail),
        createPillColumn(
          EntityKey.ROLE,
          ColumnLabel.ROLE,
          ShieldCheck,
          (val) => <><PillIndicator pulse variant="success" />{val}</>,
          { className: "text-[10px] uppercase font-bold tracking-wider py-0.5 px-2 bg-muted/60 border border-muted-foreground/10" }
        )
      )
      break

    case ProjectSlug.VILLAGES:
      cols.push(
        createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Home),
        createPillColumn(
          EntityKey.STATE,
          ColumnLabel.STATE,
          Globe,
          (val) => <><PillIcon icon={Globe} />{val}</>,
          { variant: "outline", className: "font-bold text-xs text-muted-foreground py-0.5 px-2" }
        )
      )
      break
  }

  // Timestamps
  cols.push(
    createCustomColumn(EntityKey.CREATED_AT, ColumnLabel.CREATED_AT, Calendar, (val) => (
      <span className="text-muted-foreground text-xs font-medium">{formatDateTime(val)}</span>
    ))
  )

  if (projectSlug !== ProjectSlug.DATA_ENTRIES) {
    cols.push(
      createCustomColumn(EntityKey.UPDATED_AT, ColumnLabel.UPDATED_AT, CalendarClock, (val) => (
        <span className="text-muted-foreground text-xs font-medium">{formatDateTime(val)}</span>
      ))
    )
  }

  // Actions dropdown column
  cols.push({
    id: "actions",
    cell: ({ row }) => {
      const item = row.original
      const itemId = String(getField(item, primaryIdKey))

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
