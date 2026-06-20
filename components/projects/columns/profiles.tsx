import { ColumnDef } from "@tanstack/react-table"
import { User, Factory, Mail } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createCustomColumn, resolveFactoryName, resolveUserEmail } from "./helpers"

export function getProfilesColumns<T>(): ColumnDef<T>[] {
  return [
    createCustomColumn(EntityKey.ID, ColumnLabel.EMAIL, Mail, resolveUserEmail),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, User),
    createCustomColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Factory, resolveFactoryName),
  ]
}
