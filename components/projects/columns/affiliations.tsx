import { ColumnDef } from "@tanstack/react-table"
import { Factory, Users } from "lucide-react"
import { ColumnLabel } from "@/lib/constants/enums"
import { createTextColumn, createIdColumn } from "./helpers"

export function getAffiliationsColumns<T>(): ColumnDef<T>[] {
  return [
    createIdColumn("factory_id", ColumnLabel.FACTORY_ID, Factory),
    createTextColumn("factory_name", ColumnLabel.FACTORY_NAME, Factory),
    createIdColumn("customer_id", ColumnLabel.CUSTOMER_ID, Users),
    createTextColumn("customer_name", ColumnLabel.CUSTOMER_NAME, Users),
  ]
}
