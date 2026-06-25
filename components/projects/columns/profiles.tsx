import { ColumnDef } from "@tanstack/react-table"
import { Mail, Fingerprint, Tag, Factory } from "lucide-react"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { createTextColumn, createCustomColumn } from "./helpers"

export function getProfilesColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.AADHAR_NUMBER, ColumnLabel.AADHAR_NUMBER, Fingerprint, "font-mono text-muted-foreground text-xs"),
    createTextColumn("email", ColumnLabel.EMAIL, Mail),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Tag),
    createCustomColumn("factory_id", ColumnLabel.FACTORY_ID, Factory, (val) => {
      return <div className="font-mono text-muted-foreground text-xs">{val || "—"}</div>
    }),
    createTextColumn("factory_name", ColumnLabel.FACTORY_NAME, Factory),
  ]
}
