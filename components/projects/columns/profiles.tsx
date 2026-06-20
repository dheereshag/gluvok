import { ColumnDef } from "@tanstack/react-table"
import { User, Factory, Mail } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn } from "./helpers"
import { useEntitiesStore } from "@/lib/store"
import { type User as UserType, type Profile, type Factory as FactoryType } from "@/types"
import { DataTableColumnHeader } from "@/components/data-table"

export function getProfilesColumns<T>(): ColumnDef<T>[] {
  return [
    {
      id: EntityKey.EMAIL,
      accessorFn: (row: T) => {
        const profile = row as unknown as Profile
        const userId = profile.id
        if (!userId) return ""
        const activeUsers = useEntitiesStore.getState().entities["users"] as UserType[] || []
        const user = activeUsers.find((u) => String(u.id) === String(userId))
        return user ? user.email : userId
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-muted-foreground/70" />
              {ColumnLabel.EMAIL}
            </span>
          }
        />
      ),
      cell: ({ row }) => {
        const email = row.getValue(EntityKey.EMAIL) as string
        return <div className="font-semibold text-foreground text-xs">{email || "—"}</div>
      },
      meta: { icon: Mail, label: ColumnLabel.EMAIL },
    } as ColumnDef<T>,
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, User),
    {
      id: EntityKey.FACTORY_ID,
      accessorFn: (row: T) => {
        const profile = row as unknown as Profile
        return profile.factory_id ? String(profile.factory_id) : ""
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={
            <span className="flex items-center gap-1">
              <Factory className="h-3.5 w-3.5 text-muted-foreground/70" />
              {ColumnLabel.FACTORY_ID}
            </span>
          }
        />
      ),
      cell: ({ row }) => {
        const factoryId = row.getValue(EntityKey.FACTORY_ID) as string
        return <div className="font-mono text-muted-foreground text-xs">{factoryId || "—"}</div>
      },
      meta: { icon: Factory, label: ColumnLabel.FACTORY_ID },
    } as ColumnDef<T>,
    {
      id: "factory_name",
      accessorFn: (row: T) => {
        const profile = row as unknown as Profile
        const factoryId = profile.factory_id
        if (!factoryId) return ""
        const activeFactories = useEntitiesStore.getState().entities["factories"] as FactoryType[] || []
        const factory = activeFactories.find((f) => String(f.id) === String(factoryId))
        return factory ? factory.name : `Factory ${factoryId}`
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={
            <span className="flex items-center gap-1">
              <Factory className="h-3.5 w-3.5 text-muted-foreground/70" />
              {ColumnLabel.FACTORY_NAME}
            </span>
          }
        />
      ),
      cell: ({ row }) => {
        const factoryName = row.getValue("factory_name") as string
        return <div className="font-semibold text-foreground text-xs">{factoryName || "—"}</div>
      },
      meta: { icon: Factory, label: ColumnLabel.FACTORY_NAME },
    } as ColumnDef<T>,
  ]
}
