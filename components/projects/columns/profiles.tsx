import { ColumnDef } from "@tanstack/react-table"
import { User, Factory, Mail } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createCustomColumn, resolveFactoryName, resolveUserEmail } from "./helpers"

export function getProfilesColumns<T>(): ColumnDef<T>[] {
  return [
    createCustomColumn(EntityKey.ID, ColumnLabel.EMAIL, Mail, resolveUserEmail, "user_email"),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, User),
    createTextColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Factory, "font-mono text-muted-foreground text-xs"),
    createCustomColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_NAME, Factory, resolveFactoryName, "factory_name"),
    createTextColumn(EntityKey.ID, ColumnLabel.USER_ID, User, "font-mono text-muted-foreground text-xs", "user_id"),
  ]
}
