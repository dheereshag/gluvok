"use client"

import * as React from "react"
import { useForm, type FieldValues } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { toast } from "sonner"
import { useEntitiesStore, useAuthStore } from "@/lib/store"
import { ProjectSlug, EntityKey } from "@/lib/constants/enums"
import { PROJECT_FIELDS } from "@/lib/fields"
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

  const currentUser = useAuthStore((state) => state.user)

  const userProfileId = React.useMemo(() => {
    return currentUser?.profile?.id ? String(currentUser.profile.id) : ""
  }, [currentUser])

  React.useEffect(() => {
    switch (open) {
      case true: {
        const defaultVals: Record<string, unknown> = { is_active: true }
        switch (projectSlug as ProjectSlug) {
          case ProjectSlug.WEIGHMENTS:
            switch (!!userProfileId) {
              case true:
                defaultVals[EntityKey.PROFILE_ID] = userProfileId
                break
              default:
                break
            }
            break
          default:
            break
        }
        form.reset(defaultVals)
        break
      }
      default:
        break
    }
  }, [open, form, projectSlug, userProfileId])

  const onSubmit = async (values: FieldValues) => {
    try {
      await addEntity(projectSlug as ProjectSlug, primaryIdKey, values)
      toast.success(`${projectName} created successfully`)
      onOpenChange(false)
    } catch (err) {
      const msg = err instanceof Error ? err.message : `Failed to create ${projectName.toLowerCase()}`
      toast.error(msg)
    }
  }

  return { form, fields, onSubmit }
}
