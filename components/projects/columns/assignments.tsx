import { ColumnDef } from "@tanstack/react-table"
import { Factory, User } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createCustomColumn, resolveFactoryName, resolveUserEmail } from "./helpers"

export function getAssignmentsColumns<T>(): ColumnDef<T>[] {
  return [
    createCustomColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Factory, resolveFactoryName),
    createCustomColumn(EntityKey.USER_ID, ColumnLabel.EMAIL, User, resolveUserEmail),
  ]
}
