"use client"

import { useWatch, type UseFormReturn, type FieldValues } from "react-hook-form"
import { StateCombobox, EntityCombobox } from "@/components/combobox"
import { type FieldConfig, FieldType, getReferencedEntitySlug } from "@/lib/fields"
import { StandardInput } from "./standard-input"

interface FormFieldInputProps {
  field: FieldConfig
  form: UseFormReturn<FieldValues>
  idPrefix: string
  disabled?: boolean
}

export function FormFieldInput({ field, form, idPrefix, disabled }: FormFieldInputProps) {
  const referencedSlug = getReferencedEntitySlug(field.key)
  const fieldId = `${idPrefix}-field-${field.key}`
  const value = useWatch({ control: form.control, name: field.key })

  switch (field.type) {
    case FieldType.STATE:
      return (
        <StateCombobox
          id={`${idPrefix}-state-trigger`}
          value={typeof value === "string" ? value : ""}
          onChange={(val) => form.setValue("state", val, { shouldValidate: true })}
        />
      )
    default:
      if (referencedSlug) {
        return (
          <EntityCombobox
            id={fieldId}
            entitySlug={referencedSlug}
            value={typeof value === "string" ? value : ""}
            onChange={(val) => form.setValue(field.key, val, { shouldValidate: true })}
            placeholder={field.placeholder}
          />
        )
      }
      return (
        <StandardInput
          field={field}
          form={form}
          fieldId={fieldId}
          disabled={disabled}
        />
      )
  }
}
