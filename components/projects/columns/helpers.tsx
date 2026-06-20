import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table"
import { Pill } from "@/components/kibo-ui/pill"
import { EntityKey } from "@/lib/fields"
export { getCommodityIcon } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { useEntitiesStore } from "@/lib/store"
import { type Factory as FactoryType, type User as UserType, type Village as VillageType } from "@/types"

export function createBaseColumn<T>(
  key: EntityKey, label: ColumnLabel | string, Icon: React.ComponentType<{ className?: string }>, cell: ColumnDef<T>["cell"], id?: string
): ColumnDef<T> {
  return {
    id,
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
  key: EntityKey, label: ColumnLabel | string, Icon: React.ComponentType<{ className?: string }>, renderCell: (value: string) => React.ReactNode, id?: string
): ColumnDef<T> {
  return createBaseColumn(key, label, Icon, ({ row }) => renderCell(String(row.getValue(key))), id)
}

export function createTextColumn<T>(
  key: EntityKey, label: ColumnLabel | string, Icon: React.ComponentType<{ className?: string }>, className = "font-semibold text-foreground text-xs", id?: string
): ColumnDef<T> {
  return createBaseColumn(key, label, Icon, ({ row }) => <div className={className}>{String(row.getValue(key))}</div>, id)
}

export function createPillColumn<T>(
  key: EntityKey, label: ColumnLabel, Icon: React.ComponentType<{ className?: string }>, renderContent: (value: string) => React.ReactNode,
  pillProps?: { variant?: "outline" | "secondary" | "default"; className?: string | ((value: string) => string) }, id?: string
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
  }, id)
}

export function truncateId(val: string): string {
  if (!val || val === "undefined" || val === "null") {
    return "—"
  }
  return val.length > 8 ? `${val.substring(0, 8)}...` : val
}

export function resolveFactoryName(val: string): React.ReactNode {
  if (!val || val === "undefined" || val === "null") {
    return React.createElement("div", { className: "text-muted-foreground text-xs" }, "—")
  }
  const activeFactories = useEntitiesStore.getState().entities["factories"] as FactoryType[] || []
  const factory = activeFactories.find((f) => String(f.id) === String(val))
  return React.createElement("div", { className: "font-semibold text-foreground text-xs" }, factory ? factory.name : `Factory ${val}`)
}

export function resolveUserEmail(val: string): React.ReactNode {
  if (!val || val === "undefined" || val === "null") {
    return React.createElement("div", { className: "text-muted-foreground text-xs" }, "—")
  }
  const activeUsers = useEntitiesStore.getState().entities["users"] as UserType[] || []
  const user = activeUsers.find((u) => String(u.id) === String(val))
  return React.createElement("div", { className: "font-semibold text-foreground text-xs" }, user ? user.email : val)
}

export function resolveVillageName(val: string): React.ReactNode {
  if (!val || val === "undefined" || val === "null") {
    return React.createElement("div", { className: "text-muted-foreground text-xs" }, "—")
  }
  const activeVillages = useEntitiesStore.getState().entities["villages"] as VillageType[] || []
  const village = activeVillages.find((v) => String(v.id) === String(val))
  return React.createElement("div", { className: "font-semibold text-foreground text-xs" }, village ? village.name : `Village ${val}`)
}


