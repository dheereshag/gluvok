import { ColumnDef } from "@tanstack/react-table"
import { Building, Factory } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createFactoryNameColumn } from "./helpers"

export function getCentersColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Building),
    createTextColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Factory, "font-mono text-muted-foreground text-xs"),
    createFactoryNameColumn(),
  ]
}
