"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Copy, Pencil, Trash2, Hash, Globe, Calendar, CalendarClock, Home } from "lucide-react"

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
    cell: ({ row }) => <div className="w-[80px] font-mono">{row.getValue("id")}</div>,
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
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
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
    cell: ({ row }) => <div className="w-[50px] font-medium">{row.getValue("state")}</div>,
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
    cell: ({ row }) => {
      const dateStr = row.getValue("created_at") as string
      try {
        const date = new Date(dateStr.replace(" ", "T"))
        if (!isNaN(date.getTime())) {
          return (
            <span className="text-muted-foreground">
              {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )
        }
      } catch {}
      return <span className="text-muted-foreground">{dateStr}</span>
    },
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
    cell: ({ row }) => {
      const dateStr = row.getValue("updated_at") as string
      try {
        const date = new Date(dateStr.replace(" ", "T"))
        if (!isNaN(date.getTime())) {
          return (
            <span className="text-muted-foreground">
              {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )
        }
      } catch {}
      return <span className="text-muted-foreground">{dateStr}</span>
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const village = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="text-xs cursor-pointer"
              onClick={() => navigator.clipboard.writeText(village.id)}
            >
              <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Copy village ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-xs cursor-pointer"
              onClick={() => {
                const meta = table.options.meta as {
                  onEdit?: (village: Village) => void
                  onDelete?: (village: Village) => void
                }
                if (meta?.onEdit) {
                  meta.onEdit(village)
                }
              }}
            >
              <Pencil className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Edit village
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs cursor-pointer text-destructive focus:text-destructive"
              onClick={() => {
                const meta = table.options.meta as {
                  onEdit?: (village: Village) => void
                  onDelete?: (village: Village) => void
                }
                if (meta?.onDelete) {
                  meta.onDelete(village)
                }
              }}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5 text-destructive/70" />
              Delete village
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
