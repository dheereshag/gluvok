import { ColumnDef } from "@tanstack/react-table"
import { ShieldCheck, Hash, Calendar, CalendarClock, Tag } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { formatDateTime } from "@/lib/utils"
import { createCustomColumn, truncateId, getCommodityIcon } from "./helpers"

export function getSystemColumns<T>(primaryIdKey: string): ColumnDef<T>[] {
  const isGovtOrAadhar = primaryIdKey === EntityKey.GOVT_ID || primaryIdKey === EntityKey.AADHAR_NUMBER
  const isName = primaryIdKey === EntityKey.NAME
  const label = isName ? ColumnLabel.NAME : (primaryIdKey === EntityKey.GOVT_ID ? ColumnLabel.GOVT_ID : primaryIdKey === EntityKey.AADHAR_NUMBER ? ColumnLabel.AADHAR_NUMBER : ColumnLabel.ID)
  const icon = isName ? Tag : (isGovtOrAadhar ? ShieldCheck : Hash)

  return [
    createCustomColumn<T>(
      primaryIdKey as EntityKey,
      label,
      icon,
      (val) => {
        if (primaryIdKey === EntityKey.NAME) {
          const Icon = getCommodityIcon(val)
          return (
            <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
              <Icon className="h-3.5 w-3.5 text-muted-foreground/75" />
              {val}
            </div>
          )
        }
        const displayVal = primaryIdKey === EntityKey.ID ? truncateId(val) : (val === "undefined" || val === "null" ? "" : val || "")
        return <div className="font-mono text-muted-foreground text-xs">{displayVal}</div>
      }
    ),
    createCustomColumn<T>(EntityKey.CREATED_AT, ColumnLabel.CREATED_AT, Calendar, (val) => (
      <span className="text-muted-foreground text-xs font-medium">{formatDateTime(val)}</span>
    )),
    createCustomColumn<T>(EntityKey.UPDATED_AT, ColumnLabel.UPDATED_AT, CalendarClock, (val) => (
      <span className="text-muted-foreground text-xs font-medium">{formatDateTime(val)}</span>
    )),
  ]
}
