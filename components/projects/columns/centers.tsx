import { ColumnDef } from "@tanstack/react-table"
import { Tag, Factory, Home } from "lucide-react"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { createTextColumn, createIdColumn } from "./helpers"

export function getCentersColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Tag),
    createIdColumn("factory_id", ColumnLabel.FACTORY_ID, Factory),
    createTextColumn("factory_name", ColumnLabel.FACTORY_NAME, Factory),
    createIdColumn("factory_village_id", ColumnLabel.VILLAGE_ID, Home),
    createTextColumn("factory_village_name", ColumnLabel.VILLAGE_NAME, Home),
  ]
}
