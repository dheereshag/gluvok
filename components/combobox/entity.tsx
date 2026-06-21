"use client"

import { BaseCombobox } from "./base"
import { useEntityOptions } from "./use-entity-options"

interface EntityComboboxProps {
  entitySlug: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  contextSlug?: string
  fieldKey?: string
}

export function EntityCombobox({
  entitySlug,
  value,
  onChange,
  placeholder,
  id,
  contextSlug,
  fieldKey,
}: EntityComboboxProps) {
  const comboboxData = useEntityOptions(entitySlug, contextSlug, fieldKey)

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
