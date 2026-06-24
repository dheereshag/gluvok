import { ColumnDef } from "@tanstack/react-table"
import { Factory, User } from "lucide-react"
import { ColumnLabel } from "@/lib/constants/enums"
import { createTextColumn, createIdColumn } from "./helpers"

export function getAssignmentsColumns<T>(): ColumnDef<T>[] {
  return [
    createIdColumn("factory_id", ColumnLabel.FACTORY_ID, Factory),
    createTextColumn("factory_name", ColumnLabel.FACTORY_NAME, Factory),
    createIdColumn("profile_id", ColumnLabel.PROFILE_ID, User),
    createTextColumn("profile_name", ColumnLabel.PROFILE_NAME, User),
  ]
}
