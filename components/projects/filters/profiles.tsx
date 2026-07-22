"use client"

/**
 * @file components/projects/filters/profiles.tsx
 * @description Filter controls for the Profiles entity table.
 */

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Role, RoleLabel, EntityKey } from "@/lib/constants/enums"
import { Shield } from "lucide-react"
import { BaseCombobox } from "@/components/combobox/base"

interface ProfilesFiltersProps<TData> {
  table: Table<TData>
}

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: Role.ADMIN,    label: RoleLabel.ADMIN },
  { value: Role.MANAGER,  label: RoleLabel.MANAGER },
  { value: Role.OPERATOR, label: RoleLabel.OPERATOR },
  { value: Role.BASE,     label: RoleLabel.BASE },
]

export function ProfilesFilters<TData>({ table }: ProfilesFiltersProps<TData>) {
  const columnFilters = table.getState().columnFilters
  const currentRole = columnFilters.find((f) => f.id === EntityKey.ROLE)?.value as string | undefined

  const setColumnFilter = (id: string, value: unknown) => {
    table.setColumnFilters((prev) => {
      const filtered = prev.filter((f) => f.id !== id)
      if (value !== undefined && value !== null && value !== "") {
        return [...filtered, { id, value }]
      }
      return filtered
    })
  }

  const roleOptions = React.useMemo(() => {
    return [
      { value: "all", label: "All Roles" },
      ...ROLE_OPTIONS.map((r) => ({
        value: r.value,
        label: r.label,
      })),
    ]
  }, [])

  return (
    <div className="flex items-center gap-2">
      <BaseCombobox
        type="role"
        value={currentRole ?? "all"}
        onChange={(val) => setColumnFilter(EntityKey.ROLE, val === "all" ? undefined : val)}
        data={roleOptions}
        placeholder="All Roles"
        searchPlaceholder="Search role..."
        icon={Shield}
        className="w-auto"
        id="filter-role-combobox"
      />
    </div>
  )
}
