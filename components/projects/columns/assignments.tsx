import { ColumnDef } from "@tanstack/react-table"
import { Factory, User } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createCustomColumn, resolveFactoryName } from "./helpers"
import { useEntitiesStore } from "@/lib/store"
import { type User as UserType, type Assignment } from "@/types"
import { DataTableColumnHeader } from "@/components/data-table"

export function getAssignmentsColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Factory, "font-mono text-muted-foreground text-xs"),
    createCustomColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_NAME, Factory, resolveFactoryName, "factory_name"),
    {
      id: EntityKey.EMAIL,
      accessorFn: (row: T) => {
        const assignment = row as unknown as Assignment
        const userId = assignment.user_id
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
              <User className="h-3.5 w-3.5 text-muted-foreground/70" />
              {ColumnLabel.USER_EMAIL}
            </span>
          }
        />
      ),
      cell: ({ row }) => {
        const email = row.getValue(EntityKey.EMAIL) as string
        return <div className="font-semibold text-foreground text-xs">{email || "—"}</div>
      },
      meta: { icon: User, label: ColumnLabel.USER_EMAIL },
    } as ColumnDef<T>
  ]
}
