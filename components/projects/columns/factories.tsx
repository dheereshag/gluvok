import { ColumnDef } from "@tanstack/react-table"
import { Home, Factory } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createCustomColumn, resolveVillageName } from "./helpers"

export function getFactoriesColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Factory),
    createTextColumn(EntityKey.VILLAGE_ID, ColumnLabel.VILLAGE_ID, Home, "font-mono text-muted-foreground text-xs"),
    createCustomColumn(EntityKey.VILLAGE_ID, ColumnLabel.VILLAGE_NAME, Home, resolveVillageName, "village_name"),
  ]
}
