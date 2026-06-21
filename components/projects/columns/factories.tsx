import { ColumnDef } from "@tanstack/react-table"
import { Home, Tag } from "lucide-react"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { createTextColumn, createVillageNameColumn } from "./helpers"

export function getFactoriesColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Tag),
    createTextColumn(EntityKey.VILLAGE_ID, ColumnLabel.VILLAGE_ID, Home, "font-mono text-muted-foreground text-xs"),
    createVillageNameColumn(),
  ]
}


