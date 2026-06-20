import { ColumnDef } from "@tanstack/react-table"
import { Mail, ShieldCheck } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel, Role, RoleLabel } from "@/lib/constants"
import { PillIndicator } from "@/components/kibo-ui/pill"
import { createTextColumn, createPillColumn, createFactoryIdColumn, createFactoryNameColumn } from "./helpers"

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

const getRoleClassName = (role: string) => {
  const baseClass = "h-5 py-0 px-2 text-[10px] font-semibold border transition-all duration-200"
  const normalized = role?.toLowerCase()
  switch (normalized) {
    case Role.SUPER_ADMIN:
      return `${baseClass} bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25 hover:bg-rose-500/15`
    case Role.ADMIN:
      return `${baseClass} bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 hover:bg-amber-500/15`
    case Role.MANAGER:
      return `${baseClass} bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25 hover:bg-sky-500/15`
    case Role.OPERATOR:
      return `${baseClass} bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/15`
    case Role.BASE:
    default:
      return `${baseClass} bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20 hover:bg-slate-500/15`
  }
}

export function getUsersColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.EMAIL, ColumnLabel.EMAIL, Mail),
    createPillColumn(
      EntityKey.ROLE,
      ColumnLabel.ROLE,
      ShieldCheck,
      (val) => {
        const { label, indicator } = getRoleConfig(val)
        return (
          <>
            {indicator}
            <span>{label}</span>
          </>
        )
      },
      { className: getRoleClassName }
    ),
  ]
}
