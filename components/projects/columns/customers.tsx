import { ColumnDef } from "@tanstack/react-table"
import { User, Home, Hash } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createCustomColumn, truncateId } from "./helpers"

export function getCustomersColumns<T>(): ColumnDef<T>[] {
  return [
    createCustomColumn(EntityKey.ID, ColumnLabel.ID, Hash, (val) => {
      return <div className="font-mono text-muted-foreground text-xs">{truncateId(val)}</div>
    }),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, User),
    createTextColumn(EntityKey.FATHER_NAME, ColumnLabel.FATHER_NAME, User, "text-muted-foreground text-xs"),
    createTextColumn(EntityKey.VILLAGE_ID, ColumnLabel.VILLAGE_ID, Home, "font-mono text-muted-foreground text-xs"),
  ]
}
