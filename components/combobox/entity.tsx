"use client"

import * as React from "react"
import { BaseCombobox } from "./base"
import { useEntityOptions } from "./use-entity-options"

interface EntityComboboxProps {
  entitySlug: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
}

export function EntityCombobox({
  entitySlug,
  value,
  onChange,
  placeholder,
  id,
}: EntityComboboxProps) {
  const comboboxData = useEntityOptions(entitySlug)

  return (
    <BaseCombobox
      value={value}
      onChange={onChange}
      data={comboboxData}
      type={entitySlug}
      placeholder={placeholder}
      id={id}
    />
  )
}
