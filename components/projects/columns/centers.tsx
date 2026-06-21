import { ColumnDef } from "@tanstack/react-table"
import { Tag } from "lucide-react"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { createTextColumn, createFactoryNameColumn, createFactoryIdColumn, createVillageIdColumn, createVillageNameColumn } from "./helpers"

export function getCentersColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Tag),
    createFactoryIdColumn(),
    createFactoryNameColumn(),
    createVillageIdColumn(),
    createVillageNameColumn(),
  ]
}


