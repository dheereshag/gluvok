import { ColumnDef } from "@tanstack/react-table"
import { Factory, User } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createCustomColumn, resolveFactoryName, createUserEmailColumn } from "./helpers"

export function getAssignmentsColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Factory, "font-mono text-muted-foreground text-xs"),
    createCustomColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_NAME, Factory, resolveFactoryName, EntityKey.FACTORY_NAME),
    createUserEmailColumn(ColumnLabel.USER_EMAIL, User),
  ]
}
