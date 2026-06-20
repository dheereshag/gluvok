import { ColumnDef } from "@tanstack/react-table"
import { User, Factory, Mail } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createCustomColumn } from "./helpers"
import { useEntitiesStore } from "@/lib/store"
import { type Factory as FactoryType, type User as UserType } from "@/types"

export function getProfilesColumns<T>(): ColumnDef<T>[] {
  return [
    createCustomColumn(EntityKey.ID, ColumnLabel.EMAIL, Mail, (val) => {
      if (!val || val === "undefined" || val === "null") return <div className="text-muted-foreground text-xs">—</div>
      const activeUsers = useEntitiesStore.getState().entities["users"] as UserType[] || []
      const user = activeUsers.find((u) => String(u.id) === String(val))
      return <div className="font-medium text-foreground text-xs">{user ? user.email : val}</div>
    }),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, User),
    createCustomColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Factory, (val) => {
      if (!val || val === "undefined" || val === "null") return <div className="text-muted-foreground text-xs">—</div>
      const activeFactories = useEntitiesStore.getState().entities["factories"] as FactoryType[] || []
      const factory = activeFactories.find((f) => String(f.id) === String(val))
      return <div className="font-semibold text-foreground text-xs">{factory ? factory.name : `Factory ${val}`}</div>
    }),
  ]
}
