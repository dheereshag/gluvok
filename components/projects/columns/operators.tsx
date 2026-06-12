import { ColumnDef } from "@tanstack/react-table"
import { Hash, User } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn } from "./helpers"

export function getOperatorsColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.ID, ColumnLabel.ID, Hash, "font-mono text-muted-foreground text-xs"),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, User),
  ]
}
