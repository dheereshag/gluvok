import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ShieldCheck, Hash, Calendar, CalendarClock } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { formatDateTime } from "@/lib/utils"
import { createCustomColumn } from "./helpers"

export function getSystemColumns<T>(primaryIdKey: string): ColumnDef<T>[] {
  const isGovtOrAadhar = primaryIdKey === EntityKey.GOVT_ID || primaryIdKey === EntityKey.AADHAR_NUMBER
  const label = primaryIdKey === EntityKey.GOVT_ID ? ColumnLabel.GOVT_ID : primaryIdKey === EntityKey.AADHAR_NUMBER ? ColumnLabel.AADHAR_NUMBER : ColumnLabel.ID
  const icon = isGovtOrAadhar ? ShieldCheck : Hash

  return [
    createCustomColumn<T>(
      primaryIdKey as EntityKey,
      label,
      icon,
      (val) => <div className="font-mono text-muted-foreground text-xs">{val}</div>
    ),
    createCustomColumn<T>(EntityKey.CREATED_AT, ColumnLabel.CREATED_AT, Calendar, (val) => (
      <span className="text-muted-foreground text-xs font-medium">{formatDateTime(val)}</span>
    )),
    createCustomColumn<T>(EntityKey.UPDATED_AT, ColumnLabel.UPDATED_AT, CalendarClock, (val) => (
      <span className="text-muted-foreground text-xs font-medium">{formatDateTime(val)}</span>
    )),
  ]
}
