import { ColumnDef } from "@tanstack/react-table"
import { Hash, User } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createCustomColumn, truncateId } from "./helpers"

export function getOperatorsColumns<T>(): ColumnDef<T>[] {
  return [
    createCustomColumn(EntityKey.ID, ColumnLabel.ID, Hash, (val) => {
      return <div className="font-mono text-muted-foreground text-xs">{truncateId(val)}</div>
    }),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, User),
  ]
}
