import { ColumnDef } from "@tanstack/react-table"
import { User, Home, Mail } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createUserEmailColumn, createVillageNameColumn } from "./helpers"

export function getCustomersColumns<T>(): ColumnDef<T>[] {
  return [
    createUserEmailColumn(ColumnLabel.EMAIL, Mail),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, User),
    createTextColumn(EntityKey.FATHER_NAME, ColumnLabel.FATHER_NAME, User, "text-muted-foreground text-xs"),
    createTextColumn(EntityKey.VILLAGE_ID, ColumnLabel.VILLAGE_ID, Home, "font-mono text-muted-foreground text-xs"),
    createVillageNameColumn(),
  ]
}
