/**
 * @file components/projects/columns/profiles.tsx
 * @description Column definitions and rendering helpers for the Profiles entity table.
 */

import { ColumnDef } from "@tanstack/react-table"
import { Mail, Fingerprint, Tag, Factory, Shield } from "lucide-react"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel, Role } from "@/lib/constants/enums"
import { getRoleIcon } from "@/lib/fields/helpers"
import { createTextColumn, createCustomColumn } from "./helpers"
import { useAuthStore } from "@/lib/store/auth"

export function getProfilesColumns<T>(): ColumnDef<T>[] {
  const isSuperAdmin = useAuthStore.getState().user?.role === Role.SUPER_ADMIN

  const columns: ColumnDef<T>[] = [
    createTextColumn(EntityKey.AADHAR_NUMBER, ColumnLabel.AADHAR_NUMBER, Fingerprint, "font-mono text-muted-foreground text-xs"),
    createTextColumn(EntityKey.EMAIL, ColumnLabel.EMAIL, Mail),
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Tag),
    createCustomColumn(EntityKey.ROLE, ColumnLabel.ROLE, Shield, (val) => {
      const roleStr = String(val || "")
      const RoleIcon = getRoleIcon(roleStr)
      return (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-muted/70 text-foreground border border-border/40 uppercase tracking-wide">
          <RoleIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span>{roleStr}</span>
        </div>
      )
    }),
  ]

  if (isSuperAdmin) {
    columns.push(
      createCustomColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Factory, (val) => {
        return <div className="font-mono text-muted-foreground text-xs">{val || "—"}</div>
      }),
      createTextColumn(EntityKey.FACTORY_NAME, ColumnLabel.FACTORY_NAME, Factory)
    )
  }

  return columns
}
