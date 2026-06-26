"use client"

import { Shield } from "lucide-react"
import { BaseCombobox } from "./base"
import { Role, RoleLabel } from "@/lib/constants/enums"

interface RoleComboboxProps {
  value: string
  onChange: (value: string) => void
  id?: string
}

const data = [
  { value: Role.SUPER_ADMIN, label: RoleLabel.SUPER_ADMIN },
  { value: Role.ADMIN, label: RoleLabel.ADMIN },
  { value: Role.MANAGER, label: RoleLabel.MANAGER },
  { value: Role.OPERATOR, label: RoleLabel.OPERATOR },
  { value: Role.BASE, label: RoleLabel.BASE },
]

export function RoleCombobox({ value, onChange, id }: RoleComboboxProps) {
  // Exclude SUPER_ADMIN from selection options unless it is already the selected value
  const filteredData = data.filter((item) => item.value !== Role.SUPER_ADMIN || value === Role.SUPER_ADMIN)

  return (
    <BaseCombobox
      value={value}
      onChange={onChange}
      data={filteredData}
      type="role"
      icon={Shield}
      placeholder="Select role..."
      id={id}
    />
  )
}

