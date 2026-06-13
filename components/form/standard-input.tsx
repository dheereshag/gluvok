"use client"

import { type UseFormReturn, type FieldValues } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { type FieldConfig, FieldType } from "@/lib/fields"
import { cn } from "@/lib/utils"

interface StandardInputProps {
  field: FieldConfig
  form: UseFormReturn<FieldValues>
  fieldId: string
  disabled?: boolean
}

export function StandardInput({ field, form, fieldId, disabled }: StandardInputProps) {
  return (
    <Input
      id={fieldId}
      type={field.type}
      disabled={disabled}
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
