import { ColumnDef } from "@tanstack/react-table"
import { Factory, User } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createFactoryNameColumn, createProfileNameColumn } from "./helpers"

export function getAssignmentsColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Factory, "font-mono text-muted-foreground text-xs"),
    createFactoryNameColumn(),
    createTextColumn(EntityKey.PROFILE_ID, ColumnLabel.PROFILE_ID, User, "font-mono text-muted-foreground text-xs"),
    createProfileNameColumn(),
  ]
}
