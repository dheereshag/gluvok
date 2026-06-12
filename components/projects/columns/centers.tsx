import { ColumnDef } from "@tanstack/react-table"
import { Building } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn } from "./helpers"

export function getCentersColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Building),
    createTextColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Building, "font-mono text-muted-foreground text-xs"),
  ]
}
