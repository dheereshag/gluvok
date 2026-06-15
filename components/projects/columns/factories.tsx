import { ColumnDef } from "@tanstack/react-table"
import { Building, Home, User } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn } from "./helpers"

export function getFactoriesColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Building),
    createTextColumn(EntityKey.VILLAGE_ID, ColumnLabel.VILLAGE_ID, Home, "font-mono text-muted-foreground text-xs"),
    createTextColumn(EntityKey.USER_ID, ColumnLabel.USER_ID, User, "font-mono text-muted-foreground text-xs"),
  ]
}
