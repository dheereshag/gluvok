import { ColumnDef } from "@tanstack/react-table"
import { Factory, User } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createCustomColumn } from "./helpers"
import { useEntitiesStore } from "@/lib/store"
import { type Factory as FactoryType, type User as UserType } from "@/types"

export function getAssignmentsColumns<T>(): ColumnDef<T>[] {
  return [
    createCustomColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Factory, (val) => {
      const activeFactories = useEntitiesStore.getState().entities["factories"] as FactoryType[] || []
      const factory = activeFactories.find((f) => String(f.id) === String(val))
      return <div className="font-semibold text-foreground text-xs">{factory ? factory.name : `Factory ${val}`}</div>
    }),
    createCustomColumn(EntityKey.USER_ID, ColumnLabel.EMAIL, User, (val) => {
      const activeUsers = useEntitiesStore.getState().entities["users"] as UserType[] || []
      const user = activeUsers.find((u) => String(u.id) === String(val))
      return <div className="font-semibold text-foreground text-xs">{user ? user.email : `User ${val}`}</div>
    }),
  ]
}
