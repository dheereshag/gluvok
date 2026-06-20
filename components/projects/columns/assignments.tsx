import { ColumnDef } from "@tanstack/react-table"
import { Factory, User } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createCustomColumn, resolveFactoryName, resolveUserEmail } from "./helpers"

export function getAssignmentsColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Factory, "font-mono text-muted-foreground text-xs"),
    createCustomColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_NAME, Factory, resolveFactoryName, "factory_name"),
    createTextColumn(EntityKey.USER_ID, ColumnLabel.USER_ID, User, "font-mono text-muted-foreground text-xs", "user_id"),
    createCustomColumn(EntityKey.USER_ID, ColumnLabel.USER_EMAIL, User, resolveUserEmail, "user_email"),
  ]
}
