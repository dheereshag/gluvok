import { ColumnDef } from "@tanstack/react-table"
import { Tag } from "lucide-react"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { createTextColumn, createVillageNameColumn, createVillageIdColumn } from "./helpers"

export function getFactoriesColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Tag),
    createVillageIdColumn(),
    createVillageNameColumn(),
  ]
}


