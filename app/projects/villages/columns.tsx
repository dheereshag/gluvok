"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Copy, Pencil, Trash2, Hash, Globe, Calendar, CalendarClock, Home } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { Village } from "@/data/villages"
import "./types" // Import table meta types augmentation

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

export const columns: ColumnDef<Village>[] = [
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
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={
          <span className="flex items-center gap-1">
            <Hash className="h-3.5 w-3.5 text-muted-foreground/70" />
            ID
          </span>
        }
      />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-muted-foreground text-xs">
        {row.getValue("id")}
      </div>
    ),
  },
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
    cell: ({ row }) => <div className="font-semibold text-foreground text-xs">{row.getValue("name")}</div>,
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
      <div className="font-bold text-xs text-muted-foreground bg-muted border border-muted-foreground/10 rounded px-1.5 py-0.5 inline-block">
        {row.getValue("state")}
      </div>
    ),
  },
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
        {formatDateTime(row.getValue("created_at"))}
      </span>
    ),
  },
  {
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
        {formatDateTime(row.getValue("updated_at"))}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const village = row.original

      return (
        <div className="text-right pr-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5">Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="text-xs cursor-pointer gap-2 py-2"
                onClick={() => {
                  navigator.clipboard.writeText(village.id)
                  toast.success("Village ID copied to clipboard")
                }}
              >
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-xs cursor-pointer gap-2 py-2"
                onClick={() => table.options.meta?.onEdit?.(village)}
              >
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                Edit Village
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-xs cursor-pointer gap-2 py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={() => table.options.meta?.onDelete?.(village)}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                Delete Village
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
