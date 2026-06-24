import { ColumnDef } from "@tanstack/react-table"
import { Tag, Home } from "lucide-react"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { createTextColumn, createIdColumn } from "./helpers"

export function getFactoriesColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Tag),
    createIdColumn("village_id", ColumnLabel.VILLAGE_ID, Home),
    createTextColumn("village_name", ColumnLabel.VILLAGE_NAME, Home),
  ]
}
