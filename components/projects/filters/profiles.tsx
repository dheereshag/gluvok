"use client"

/**
 * @file components/projects/filters/profiles.tsx
 * @description Filter controls for the Profiles entity table.
 */

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Role, RoleLabel, EntityKey } from "@/lib/constants/enums"
import { Shield } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select"

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

  const selectedRoleOption = ROLE_OPTIONS.find((r) => r.value === currentRole)

  const setColumnFilter = (id: string, value: unknown) => {
    table.setColumnFilters((prev) => {
      const filtered = prev.filter((f) => f.id !== id)
      if (value !== undefined && value !== null && value !== "") {
        return [...filtered, { id, value }]
      }
      return filtered
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentRole ?? "all"}
        onValueChange={(val) => setColumnFilter(EntityKey.ROLE, val === "all" ? undefined : val)}
      >
        <SelectTrigger aria-label="Filter by Role" className="h-9 text-xs bg-background shadow-sm">
          <div className="flex items-center gap-1.5 truncate">
            <Shield className="h-3.5 w-3.5 text-muted-foreground/75 shrink-0" />
            <span className="truncate">
              {selectedRoleOption ? selectedRoleOption.label : "All Roles"}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            <SelectLabel>Role</SelectLabel>
            <SelectItem value="all" className="text-xs">
              All Roles
            </SelectItem>
            {ROLE_OPTIONS.map((r) => (
              <SelectItem key={r.value} value={r.value} className="text-xs uppercase tracking-wide">
                {r.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
