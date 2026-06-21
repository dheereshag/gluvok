"use client"

import { Weight } from "lucide-react"
import { BaseCombobox } from "./base"
import { Unit } from "@/lib/constants/enums"

interface UnitComboboxProps {
  value: string
  onChange: (value: string) => void
  id?: string
}

const data = [
  { value: Unit.KG, label: Unit.KG },
  { value: Unit.Q, label: Unit.Q },
  { value: Unit.GAL, label: Unit.GAL },
]

export function UnitCombobox({ value, onChange, id }: UnitComboboxProps) {
  return (
    <BaseCombobox
      value={value}
      onChange={onChange}
      data={data}
      type="unit"
      icon={Weight}
      placeholder="Select unit..."
      id={id}
    />
  )
}
