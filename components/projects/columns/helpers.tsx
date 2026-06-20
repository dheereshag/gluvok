import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table"
import { Pill } from "@/components/kibo-ui/pill"
import { EntityKey, ProjectSlug } from "@/lib/fields"
export { getCommodityIcon } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { useEntitiesStore } from "@/lib/store"
import { type Factory as FactoryType, type User as UserType, type Village as VillageType } from "@/types"
import { User, Factory, Home } from "lucide-react"

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
  return createBaseColumn(key, label, Icon, ({ row }) => {
    const val = (row.original as Record<string, unknown>)[key]
    return renderCell(String(val ?? ""))
  }, id)
}

export function createTextColumn<T>(
  key: EntityKey, label: ColumnLabel | string, Icon: React.ComponentType<{ className?: string }>, className = "font-semibold text-foreground text-xs", id?: string
): ColumnDef<T> {
  return createBaseColumn(key, label, Icon, ({ row }) => {
    const val = (row.original as Record<string, unknown>)[key]
    return <div className={className}>{String(val ?? "")}</div>
  }, id)
}

export function createPillColumn<T>(
  key: EntityKey, label: ColumnLabel, Icon: React.ComponentType<{ className?: string }>, renderContent: (value: string) => React.ReactNode,
  pillProps?: { variant?: "outline" | "secondary" | "default"; className?: string | ((value: string) => string) }, id?: string
): ColumnDef<T> {
  return createBaseColumn(key, label, Icon, ({ row }) => {
    const val = String((row.original as Record<string, unknown>)[key] ?? "")
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
  const activeFactories = useEntitiesStore.getState().entities[ProjectSlug.FACTORIES] as FactoryType[] || []
  const factory = activeFactories.find((f) => String(f.id) === String(val))
  return React.createElement("div", { className: "font-semibold text-foreground text-xs" }, factory ? factory.name : `Factory ${val}`)
}

export function resolveUserEmail(val: string): React.ReactNode {
  if (!val || val === "undefined" || val === "null") {
    return React.createElement("div", { className: "text-muted-foreground text-xs" }, "—")
  }
  const activeUsers = useEntitiesStore.getState().entities[ProjectSlug.USERS] as UserType[] || []
  const user = activeUsers.find((u) => String(u.id) === String(val))
  return React.createElement("div", { className: "font-semibold text-foreground text-xs" }, user ? user.email : val)
}

export function resolveVillageName(val: string): React.ReactNode {
  if (!val || val === "undefined" || val === "null") {
    return React.createElement("div", { className: "text-muted-foreground text-xs" }, "—")
  }
  const activeVillages = useEntitiesStore.getState().entities[ProjectSlug.VILLAGES] as VillageType[] || []
  const village = activeVillages.find((v) => String(v.id) === String(val))
  return React.createElement("div", { className: "font-semibold text-foreground text-xs" }, village ? village.name : `Village ${val}`)
}

export function createUserEmailColumn<T>(
  label: ColumnLabel | string,
  Icon: React.ComponentType<{ className?: string }> = User,
  id: string = EntityKey.EMAIL
): ColumnDef<T> {
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const userId = record.user_id || record.id
      if (!userId || typeof userId !== "string") return ""
      const activeUsers = useEntitiesStore.getState().entities[ProjectSlug.USERS] as UserType[] || []
      const user = activeUsers.find((u) => String(u.id) === String(userId))
      return user ? user.email : userId
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={<span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5 text-muted-foreground/70" />{label}</span>}
      />
    ),
    cell: ({ row }) => {
      const email = row.getValue(id) as string
      return <div className="font-semibold text-foreground text-xs">{email || "—"}</div>
    },
    meta: { icon: Icon, label },
  }
}

export function createFactoryIdColumn<T>(): ColumnDef<T> {
  const id = EntityKey.FACTORY_ID
  const label = ColumnLabel.FACTORY_ID
  const Icon = Factory
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      return record.factory_id ? String(record.factory_id) : ""
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={<span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5 text-muted-foreground/70" />{label}</span>}
      />
    ),
    cell: ({ row }) => {
      const factoryId = row.getValue(id) as string
      return <div className="font-mono text-muted-foreground text-xs">{factoryId || "—"}</div>
    },
    meta: { icon: Icon, label },
  }
}

export function createFactoryNameColumn<T>(): ColumnDef<T> {
  const id = EntityKey.FACTORY_NAME
  const label = ColumnLabel.FACTORY_NAME
  const Icon = Factory
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const factoryId = record.factory_id
      if (!factoryId) return ""
      const activeFactories = useEntitiesStore.getState().entities[ProjectSlug.FACTORIES] as FactoryType[] || []
      const factory = activeFactories.find((f) => String(f.id) === String(factoryId))
      return factory ? factory.name : `Factory ${factoryId}`
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={<span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5 text-muted-foreground/70" />{label}</span>}
      />
    ),
    cell: ({ row }) => {
      const factoryName = row.getValue(id) as string
      return <div className="font-semibold text-foreground text-xs">{factoryName || "—"}</div>
    },
    meta: { icon: Icon, label },
  }
}

export function createVillageNameColumn<T>(): ColumnDef<T> {
  const id = EntityKey.VILLAGE_NAME
  const label = ColumnLabel.VILLAGE_NAME
  const Icon = Home
  return {
    id,
    accessorFn: (row: T) => {
      const record = row as Record<string, unknown>
      const villageId = record.village_id
      if (!villageId) return ""
      const activeVillages = useEntitiesStore.getState().entities[ProjectSlug.VILLAGES] as VillageType[] || []
      const village = activeVillages.find((v) => String(v.id) === String(villageId))
      return village ? village.name : `Village ${villageId}`
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={<span className="flex items-center gap-1"><Icon className="h-3.5 w-3.5 text-muted-foreground/70" />{label}</span>}
      />
    ),
    cell: ({ row }) => {
      const villageName = row.getValue(id) as string
      return <div className="font-semibold text-foreground text-xs">{villageName || "—"}</div>
    },
    meta: { icon: Icon, label },
  }
}


