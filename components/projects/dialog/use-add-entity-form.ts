"use client"

import * as React from "react"
import { useForm, type FieldValues } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { toast } from "sonner"
import { useEntitiesStore } from "@/lib/store"
import { PROJECT_FIELDS, type ProjectSlug } from "@/lib/fields"
import { ENTITY_ADD_SCHEMAS } from "@/lib/validation"
import { type EntityFormProps } from "./types"

export function useAddEntityForm({
  open,
  onOpenChange,
  projectSlug,
  projectName,
  primaryIdKey,
}: EntityFormProps) {
  const addEntity = useEntitiesStore((state) => state.addEntity)
  const fields = React.useMemo(() => PROJECT_FIELDS[projectSlug] || [], [projectSlug])
  const formSchema = ENTITY_ADD_SCHEMAS[projectSlug as ProjectSlug]
  const form = useForm<FieldValues>({ resolver: standardSchemaResolver(formSchema), defaultValues: {} })

  React.useEffect(() => {
    if (open) form.reset({})
  }, [open, form])

  const onSubmit = (values: FieldValues) => {
    try {
      addEntity(projectSlug, primaryIdKey, values)
      toast.success(`${projectName} created successfully`)
      onOpenChange(false)
    } catch {
      toast.error(`Failed to create ${projectName.toLowerCase()}`)
    }
  }

  return { form, fields, onSubmit }
}
