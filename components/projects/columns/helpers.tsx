import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table"
import { Pill } from "@/components/kibo-ui/pill"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { Sprout, Wheat, Droplet, Hammer, Package, type LucideIcon } from "lucide-react"

export function createBaseColumn<T>(
  key: EntityKey, label: ColumnLabel | string, Icon: React.ComponentType<{ className?: string }>, cell: ColumnDef<T>["cell"]
): ColumnDef<T> {
  return {
    accessorKey: key,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={<span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5 text-muted-foreground/70" />{label}</span>}
      />
    ),
    cell,
    meta: { icon: Icon, label },
  }
}

export function createCustomColumn<T>(
  key: EntityKey, label: ColumnLabel | string, Icon: React.ComponentType<{ className?: string }>, renderCell: (value: string) => React.ReactNode
): ColumnDef<T> {
  return createBaseColumn(key, label, Icon, ({ row }) => renderCell(String(row.getValue(key))))
}

export function createTextColumn<T>(
  key: EntityKey, label: ColumnLabel, Icon: React.ComponentType<{ className?: string }>, className = "font-semibold text-foreground text-xs"
): ColumnDef<T> {
  return createBaseColumn(key, label, Icon, ({ row }) => <div className={className}>{String(row.getValue(key))}</div>)
}

export function createPillColumn<T>(
  key: EntityKey, label: ColumnLabel, Icon: React.ComponentType<{ className?: string }>, renderContent: (value: string) => React.ReactNode,
  pillProps?: { variant?: "outline" | "secondary" | "default"; className?: string | ((value: string) => string) }
): ColumnDef<T> {
  return createBaseColumn(key, label, Icon, ({ row }) => {
    const val = String(row.getValue(key))
    const resolvedClassName = typeof pillProps?.className === "function"
      ? pillProps.className(val)
      : pillProps?.className

    return (
      <Pill variant={pillProps?.variant || "secondary"} className={resolvedClassName}>
        {renderContent(val)}
      </Pill>
    )
  })
}

export function truncateId(val: string): string {
  if (!val || val === "undefined" || val === "null") {
    return "—"
  }
  return val.length > 8 ? `${val.substring(0, 8)}...` : val
}

export function getCommodityIcon(name: string): LucideIcon {
  const norm = name?.toLowerCase().trim() || ""
  if (norm.includes("wheat")) return Wheat
  if (norm.includes("corn")) return Sprout
  if (norm.includes("oil") || norm.includes("crude")) return Droplet
  if (norm.includes("copper") || norm.includes("scrap") || norm.includes("metal")) return Hammer
  return Package
}
