"use client"

/**
 * @file components/combobox/role.tsx
 * @description Combobox selector specifically built for selecting user roles.
 * Limits option lists depending on the current user's role/value.
 */

import { BaseCombobox } from "./base"
import { Role, RoleLabel } from "@/lib/constants/enums"
import { getRoleIcon } from "@/lib/fields/helpers"

interface RoleComboboxProps {
  value: string
  onChange: (value: string) => void
  id?: string
}

/**
 * RoleCombobox Component
 * Renders a dropdown to select a role. Ensures SUPER_ADMIN is only selectable
 * if the user being edited is already a SUPER_ADMIN.
 */
export function RoleCombobox({ value, onChange, id }: RoleComboboxProps) {
  const data = [
    ...(value === Role.SUPER_ADMIN ? [{ value: Role.SUPER_ADMIN, label: RoleLabel.SUPER_ADMIN }] : []),
    { value: Role.ADMIN, label: RoleLabel.ADMIN },
    { value: Role.MANAGER, label: RoleLabel.MANAGER },
    { value: Role.OPERATOR, label: RoleLabel.OPERATOR },
    { value: Role.BASE, label: RoleLabel.BASE },
  ]

  const ActiveIcon = getRoleIcon(value)

  return (
    <BaseCombobox
      value={value}
      onChange={onChange}
      data={data}
      type="role"
      icon={ActiveIcon}
      placeholder="Select role..."
      id={id}
    />
  )
}

