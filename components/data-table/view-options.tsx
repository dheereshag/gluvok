"use client"

import { type Table } from "@tanstack/react-table"
import { Settings2, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { COLUMN_ICONS, getColumnLabel } from "./view-options-helpers"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button id="view-options-trigger" variant="outline" size="sm" className="h-9 text-xs font-medium gap-1.5">
          <Settings2 className="h-4 w-4" /> View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel className="text-xs">Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide())
          .map((column) => {
            const meta = column.columnDef.meta as { icon?: React.ComponentType<{ className?: string }>, label?: string } | undefined
            const Icon = meta?.icon || COLUMN_ICONS[column.id] || HelpCircle
            const label = meta?.label || getColumnLabel(column.id)
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="text-xs flex items-center gap-2"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                <Icon className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span>{label}</span>
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
