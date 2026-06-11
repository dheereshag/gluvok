"use client"

import { type Table } from "@tanstack/react-table"
import { Settings2, Hash, Globe, Calendar, CalendarClock, Home, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

const COLUMN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  id: Hash,
  name: Home,
  state: Globe,
  created_at: Calendar,
  updated_at: CalendarClock,
};

function getColumnLabel(id: string) {
  const customLabels: Record<string, string> = {
    id: "ID",
    created_at: "Created At",
    updated_at: "Updated At",
  };
  if (customLabels[id]) return customLabels[id];
  return id
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          id="view-options-trigger"
          variant="outline"
          size="sm"
          className="h-9 text-xs font-medium gap-1.5"
        >
          <Settings2 className="h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel className="text-xs">Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            const Icon = COLUMN_ICONS[column.id] || HelpCircle;
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="text-xs flex items-center gap-2"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                <Icon className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span>{getColumnLabel(column.id)}</span>
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
