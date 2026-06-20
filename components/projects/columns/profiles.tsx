import { ColumnDef } from "@tanstack/react-table"
import { User, Mail } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createUserEmailColumn, createFactoryIdColumn, createFactoryNameColumn } from "./helpers"

export function getProfilesColumns<T>(): ColumnDef<T>[] {
  return [
    createUserEmailColumn(ColumnLabel.EMAIL, Mail),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, User),
    createFactoryIdColumn(),
    createFactoryNameColumn(),
  ]
}
