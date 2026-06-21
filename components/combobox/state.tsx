"use client"

import { MapPin } from "lucide-react"
import { BaseCombobox } from "./base"
import { STATES_DATA } from "./states-data"

interface StateComboboxProps {
  value: string
  onChange: (value: string) => void
  id?: string
}

const data = STATES_DATA.map((s) => ({
  value: s.value,
  label: s.label,
  rightLabel: s.code,
}))

export function StateCombobox({ value, onChange, id }: StateComboboxProps) {
  return (
    <BaseCombobox
      value={value}
      onChange={onChange}
      data={data}
      type="state"
      icon={MapPin}
      placeholder="Select state..."
      id={id}
    />
  )
}
