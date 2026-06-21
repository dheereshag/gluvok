import { ColumnDef } from "@tanstack/react-table"
import { Mail, ShieldCheck } from "lucide-react"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel, Role, RoleLabel } from "@/lib/constants/enums"
import { PillIndicator } from "@/components/kibo-ui/pill"
import { createTextColumn, createCustomColumn } from "./helpers"

const renderRoleIndicator = (variant: "success" | "error" | "warning" | "info" | "muted", pulse = true) => {
  if (variant === "muted") {
    return (
      <span className="relative flex size-2">
        <span className="relative inline-flex size-2 rounded-full bg-muted-foreground/50" />
      </span>
    )
  }
  return <PillIndicator pulse={pulse} variant={variant} />
}

const getRoleConfig = (role: string) => {
  const normalized = role?.toLowerCase()
  switch (normalized) {
    case Role.SUPER_ADMIN:
      return {
        label: RoleLabel.SUPER_ADMIN,
        indicator: renderRoleIndicator("error"),
      }
    case Role.ADMIN:
      return {
        label: RoleLabel.ADMIN,
        indicator: renderRoleIndicator("warning"),
      }
    case Role.MANAGER:
      return {
        label: RoleLabel.MANAGER,
        indicator: renderRoleIndicator("info"),
      }
    case Role.OPERATOR:
      return {
        label: RoleLabel.OPERATOR,
        indicator: renderRoleIndicator("success"),
      }
    case Role.BASE:
    default:
      return {
        label: RoleLabel.BASE,
        indicator: renderRoleIndicator("muted"),
      }
  }
}

export function getUsersColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.EMAIL, ColumnLabel.EMAIL, Mail),
    createCustomColumn(
      EntityKey.ROLE,
      ColumnLabel.ROLE,
      ShieldCheck,
      (val: string) => {
        const { label, indicator } = getRoleConfig(val)
        return (
          <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
            {indicator}
            <span>{label}</span>
          </div>
        )
      }
    ),
  ]
}

