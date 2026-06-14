"use client"

import * as React from "react"
import { useForm, type FieldValues, type Path } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { toast } from "sonner"
import { type EntityRecord } from "@/types"
import { useEntitiesStore, getField } from "@/lib/store"
import { PROJECT_FIELDS, ProjectSlug } from "@/lib/fields"
import { ENTITY_EDIT_SCHEMAS, checkEditUniqueness } from "@/lib/validation"
import { type EntityFormProps } from "./types"

interface UseEditEntityFormProps extends EntityFormProps {
  item: EntityRecord
}

export function useEditEntityForm({
  open,
  onOpenChange,
  projectSlug,
  projectName,
  primaryIdKey,
  item,
}: UseEditEntityFormProps) {
  const updateEntity = useEntitiesStore((state) => state.updateEntity)
  const fields = React.useMemo(() => PROJECT_FIELDS[projectSlug] || [], [projectSlug])
  const formSchema = ENTITY_EDIT_SCHEMAS[projectSlug as ProjectSlug]
  const form = useForm<FieldValues>({ resolver: standardSchemaResolver(formSchema), defaultValues: {} })

  React.useEffect(() => {
    if (open) {
      const defaults: Record<string, unknown> = {}
      fields.forEach((field) => {
        let rawVal = getField(item, field.key)
        if (field.transformOnChange && typeof rawVal === "string") {
          rawVal = field.transformOnChange(rawVal)
        }
        defaults[field.key] = Array.isArray(rawVal) ? rawVal : (rawVal !== undefined && rawVal !== null ? String(rawVal) : "")
      })
      form.reset(defaults)
    }
  }, [open, item, fields, form])

  const onSubmit = (values: FieldValues) => {
    const uniquenessError = checkEditUniqueness(projectSlug as ProjectSlug, item, values)
    if (uniquenessError) {
      form.setError(uniquenessError.field as Path<FieldValues>, { message: uniquenessError.message })
      return
    }

    try {
      updateEntity(projectSlug, primaryIdKey, String(getField(item, primaryIdKey)), values)
      toast.success(`${projectName} updated successfully`)
      onOpenChange(false)
    } catch {
      toast.error(`Failed to update ${projectName.toLowerCase()}`)
    }
  }

  return { form, fields, onSubmit }
}
