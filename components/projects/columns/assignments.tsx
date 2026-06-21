import { ColumnDef } from "@tanstack/react-table"
import { Factory } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createFactoryNameColumn, createProfileNameColumn, createProfileAadharColumn } from "./helpers"

export function getAssignmentsColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Factory, "font-mono text-muted-foreground text-xs"),
    createFactoryNameColumn(),
    createProfileAadharColumn(),
    createProfileNameColumn(),
  ]
}

