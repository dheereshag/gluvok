"use client"

import { type EntityRecord } from "@/types"
import { DialogMode } from "@/lib/constants"
import { type EntityFormProps } from "./types"
import { useAddEntityForm } from "./use-add-entity-form"
import { useEditEntityForm } from "./use-edit-entity-form"

interface UseEntityFormProps extends EntityFormProps {
  mode: DialogMode
  item?: EntityRecord | null
}

export function useEntityForm({
  mode,
  open,
  onOpenChange,
  projectSlug,
  projectName,
  primaryIdKey,
  item,
}: UseEntityFormProps) {
  const isEdit = mode === DialogMode.EDIT

  const addForm = useAddEntityForm({
    open: open && !isEdit,
    onOpenChange,
    projectSlug,
    projectName,
    primaryIdKey,
  })

  const editForm = useEditEntityForm({
    open: open && isEdit,
    onOpenChange,
    projectSlug,
    projectName,
    primaryIdKey,
    item: item ?? ({} as EntityRecord),
  })

  return {
    form: isEdit ? editForm.form : addForm.form,
    fields: isEdit ? editForm.fields : addForm.fields,
    onSubmit: isEdit ? editForm.onSubmit : addForm.onSubmit,
    isEdit,
  }
}
