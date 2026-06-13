"use client"

import { useWatch, type UseFormReturn, type FieldValues } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { StateCombobox, EntityCombobox } from "@/components/combobox"
import { type FieldConfig, FieldType, getReferencedEntitySlug } from "@/lib/fields"
import { cn } from "@/lib/utils"

interface FormFieldInputProps {
  field: FieldConfig
  form: UseFormReturn<FieldValues>
  idPrefix: string
}

export function FormFieldInput({ field, form, idPrefix }: FormFieldInputProps) {
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
        <Input
          id={fieldId}
          type={field.type}
          step={field.type === FieldType.NUMBER ? "any" : undefined}
          {...form.register(field.key, {
            onChange: (e) => {
              if (field.transformOnChange) {
                e.target.value = field.transformOnChange(e.target.value)
              }
            }
          })}
          placeholder={field.placeholder}
          className={cn(
            "h-9 text-xs focus-visible:ring-1 focus-visible:ring-primary/50 transition-shadow",
            field.className
          )}
        />
      )
  }
}
