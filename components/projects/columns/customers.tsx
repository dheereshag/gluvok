import { ColumnDef } from "@tanstack/react-table"
import { User, Home, Hash } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn } from "./helpers"

export function getCustomersColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.ID, ColumnLabel.ID, Hash, "font-mono text-muted-foreground text-xs"),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, User),
    createTextColumn(EntityKey.FATHER_NAME, ColumnLabel.FATHER_NAME, User, "text-muted-foreground text-xs"),
    createTextColumn(EntityKey.VILLAGE_ID, ColumnLabel.VILLAGE_ID, Home, "font-mono text-muted-foreground text-xs"),
  ]
}
