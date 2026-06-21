import { ColumnDef } from "@tanstack/react-table"
import { Factory, Tag } from "lucide-react"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { createTextColumn, createFactoryNameColumn } from "./helpers"

export function getCentersColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Tag),
    createTextColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Factory, "font-mono text-muted-foreground text-xs"),
    createFactoryNameColumn(),
  ]
}


