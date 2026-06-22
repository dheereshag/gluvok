import { ColumnDef } from "@tanstack/react-table"
import { Mail, Fingerprint, Tag } from "lucide-react"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { createTextColumn, createUserEmailColumn, createProfileFactoryIdColumn, createProfileFactoryNameColumn } from "./helpers"

export function getProfilesColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.AADHAR_NUMBER, ColumnLabel.AADHAR_NUMBER, Fingerprint, "font-mono text-muted-foreground text-xs"),
    createUserEmailColumn(ColumnLabel.EMAIL, Mail),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Tag),

    createProfileFactoryIdColumn(),
    createProfileFactoryNameColumn(),
  ]
}
