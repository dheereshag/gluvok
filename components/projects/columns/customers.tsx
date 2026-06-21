import { ColumnDef } from "@tanstack/react-table"
import { User, Home, Mail, ShieldCheck, Tag } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createUserEmailColumn, createVillageNameColumn } from "./helpers"

export function getCustomersColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.GOVT_ID, ColumnLabel.GOVT_ID, ShieldCheck, "font-mono text-muted-foreground text-xs"),
    createUserEmailColumn(ColumnLabel.EMAIL, Mail),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Tag),


    createTextColumn(EntityKey.FATHER_NAME, ColumnLabel.FATHER_NAME, User, "text-muted-foreground text-xs"),
    createTextColumn(EntityKey.VILLAGE_ID, ColumnLabel.VILLAGE_ID, Home, "font-mono text-muted-foreground text-xs"),
    createVillageNameColumn(),
  ]
}

