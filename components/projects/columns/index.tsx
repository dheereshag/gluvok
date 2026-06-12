import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { type EntityRecord } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import { getField } from "@/lib/store"
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
  ShieldCheck,
} from "lucide-react"
import { toast } from "sonner"
import { ProjectSlug, EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { formatDateTime } from "@/lib/utils"

import { createCustomColumn } from "./helpers"
import { getCentersColumns } from "./centers"
import { getCommoditiesColumns } from "./commodities"
import { getCustomersColumns } from "./customers"
import { getDataEntriesColumns } from "./data-entries"
import { getFactoriesColumns } from "./factories"
import { getOperatorsColumns } from "./operators"
import { getUsersColumns } from "./users"
import { getVillagesColumns } from "./villages"

export interface ColumnActionsCallbacks<T = EntityRecord> {
  onEdit: (item: T) => void
  onDelete: (item: T) => void
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
      cols.push(...getCentersColumns<T>())
      break
    case ProjectSlug.COMMODITIES:
      cols.push(...getCommoditiesColumns<T>())
      break
    case ProjectSlug.CUSTOMERS:
      cols.push(...getCustomersColumns<T>())
      break
    case ProjectSlug.DATA_ENTRIES:
      cols.push(...getDataEntriesColumns<T>())
      break
    case ProjectSlug.FACTORIES:
      cols.push(...getFactoriesColumns<T>())
      break
    case ProjectSlug.OPERATORS:
      cols.push(...getOperatorsColumns<T>())
      break
    case ProjectSlug.USERS:
      cols.push(...getUsersColumns<T>())
      break
    case ProjectSlug.VILLAGES:
      cols.push(...getVillagesColumns<T>())
      break
  }

  // Timestamps
  cols.push(
    createCustomColumn(EntityKey.CREATED_AT, ColumnLabel.CREATED_AT, Calendar, (val) => (
      <span className="text-muted-foreground text-xs font-medium">{formatDateTime(val)}</span>
    ))
  )

  cols.push(
    createCustomColumn(EntityKey.UPDATED_AT, ColumnLabel.UPDATED_AT, CalendarClock, (val) => (
      <span className="text-muted-foreground text-xs font-medium">{formatDateTime(val)}</span>
    ))
  )

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
