"use client"

/**
 * @file components/combobox/state.tsx
 * @description State selector combobox component.
 * Maps state codes and names into options for dropdown selection.
 */

import { MapPin } from "lucide-react"
import { BaseCombobox } from "./base"
import { STATES_DATA } from "@/lib/constants"


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

/**
 * StateCombobox Component
 * Renders a dropdown to select a state, displaying state names and state short codes.
 */
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
