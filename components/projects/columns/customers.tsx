import { ColumnDef } from "@tanstack/react-table"
import { User, Home, Mail } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createCustomColumn } from "./helpers"
import { useEntitiesStore } from "@/lib/store"
import { type User as UserType } from "@/types"

export function getCustomersColumns<T>(): ColumnDef<T>[] {
  return [
    createCustomColumn(EntityKey.ID, ColumnLabel.EMAIL, Mail, (val) => {
      if (!val || val === "undefined" || val === "null") return <div className="text-muted-foreground text-xs">—</div>
      const activeUsers = useEntitiesStore.getState().entities["users"] as UserType[] || []
      const user = activeUsers.find((u) => String(u.id) === String(val))
      return <div className="font-medium text-foreground text-xs">{user ? user.email : val}</div>
    }),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, User),
    createTextColumn(EntityKey.FATHER_NAME, ColumnLabel.FATHER_NAME, User, "text-muted-foreground text-xs"),
    createTextColumn(EntityKey.VILLAGE_ID, ColumnLabel.VILLAGE_ID, Home, "font-mono text-muted-foreground text-xs"),
  ]
}
