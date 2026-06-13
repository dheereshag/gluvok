"use client"

import * as React from "react"
import { useForm, type FieldValues } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { toast } from "sonner"
import { type EntityRecord } from "@/types"
import { useEntitiesStore, getField } from "@/lib/store"
import { PROJECT_FIELDS, type ProjectSlug } from "@/lib/fields"
import { ENTITY_ADD_SCHEMAS, ENTITY_EDIT_SCHEMAS } from "@/lib/validation"
import { DialogMode } from "@/lib/constants"

interface UseEntityFormProps {
  mode: DialogMode; open: boolean; onOpenChange: (open: boolean) => void
  projectSlug: string; projectName: string; primaryIdKey: string; item?: EntityRecord | null
}

export function useEntityForm({
  mode, open, onOpenChange, projectSlug, projectName, primaryIdKey, item
}: UseEntityFormProps) {
  const addEntity = useEntitiesStore((state) => state.addEntity)
  const updateEntity = useEntitiesStore((state) => state.updateEntity)
  const isEdit = mode === DialogMode.EDIT
  const fields = React.useMemo(() => PROJECT_FIELDS[projectSlug] || [], [projectSlug])
  const formSchema = React.useMemo(() => {
    return isEdit ? ENTITY_EDIT_SCHEMAS[projectSlug as ProjectSlug] : ENTITY_ADD_SCHEMAS[projectSlug as ProjectSlug]
  }, [projectSlug, isEdit])
  const form = useForm<FieldValues>({ resolver: standardSchemaResolver(formSchema), defaultValues: {} })

  React.useEffect(() => {
    if (open) {
      if (isEdit && item) {
        const defaults: Record<string, any> = {}
        fields.forEach((field) => {
          const rawVal = getField(item, field.key)
          defaults[field.key] = Array.isArray(rawVal) ? rawVal : (rawVal !== undefined && rawVal !== null ? String(rawVal) : "")
        })
        form.reset(defaults)
      } else form.reset({})
    }
  }, [open, isEdit, item, fields, form])

  const onSubmit = (values: FieldValues) => {
    try {
      if (isEdit) {
        if (!item) return
        updateEntity(projectSlug, primaryIdKey, String(getField(item, primaryIdKey)), values)
        toast.success(`${projectName} updated successfully`)
      } else {
        addEntity(projectSlug, primaryIdKey, values)
        toast.success(`${projectName} created successfully`)
      }
      onOpenChange(false)
    } catch {
      toast.error(`Failed to ${isEdit ? "update" : "create"} ${projectName.toLowerCase()}`)
    }
  }

  return { form, fields, isEdit, onSubmit }
}
