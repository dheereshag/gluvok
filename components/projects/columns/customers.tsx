import { ColumnDef } from "@tanstack/react-table"
import { User, Mail, ShieldCheck, Tag, Home } from "lucide-react"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { createTextColumn, createIdColumn, createCustomColumn } from "./helpers"

export function getCustomersColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.GOVT_ID, ColumnLabel.GOVT_ID, ShieldCheck, "font-mono text-muted-foreground text-xs"),
    createCustomColumn(EntityKey.USER_EMAIL, ColumnLabel.EMAIL, Mail, (userEmail) => {
      if (!userEmail) return <span className="text-muted-foreground">—</span>
      return <div className="font-semibold text-foreground text-xs">{userEmail}</div>
    }),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Tag),
    createTextColumn(EntityKey.FATHER_NAME, ColumnLabel.FATHER_NAME, User, "text-muted-foreground text-xs"),
    createIdColumn(EntityKey.VILLAGE_ID, ColumnLabel.VILLAGE_ID, Home),
    createTextColumn(EntityKey.VILLAGE_NAME, ColumnLabel.VILLAGE_NAME, Home),
  ]
}

