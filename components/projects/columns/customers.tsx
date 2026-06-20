import { ColumnDef } from "@tanstack/react-table"
import { User, Home, Mail } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createCustomColumn, resolveUserEmail, resolveVillageName } from "./helpers"

export function getCustomersColumns<T>(): ColumnDef<T>[] {
  return [
    createCustomColumn(EntityKey.ID, ColumnLabel.EMAIL, Mail, resolveUserEmail, EntityKey.EMAIL),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, User),
    createTextColumn(EntityKey.FATHER_NAME, ColumnLabel.FATHER_NAME, User, "text-muted-foreground text-xs"),
    createTextColumn(EntityKey.VILLAGE_ID, ColumnLabel.VILLAGE_ID, Home, "font-mono text-muted-foreground text-xs"),
    createCustomColumn(EntityKey.VILLAGE_ID, ColumnLabel.VILLAGE_NAME, Home, resolveVillageName, EntityKey.VILLAGE_NAME),
  ]
}
