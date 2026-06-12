"use client"

import * as React from "react"
import { type EntityRecord } from "@/types"
import { useForm, type FieldValues } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"

import { toast } from "sonner"
import { Pencil, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEntitiesStore, getField } from "@/lib/store"
import { FormFieldInput } from "@/components/form"
import { PROJECT_FIELDS, type ProjectSlug } from "@/lib/fields"
import { ENTITY_EDIT_SCHEMAS } from "@/lib/validation"

interface EditEntityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectSlug: string
  projectName: string
  primaryIdKey: string
  item: EntityRecord | null
}

export function EditEntityDialog({
  open,
  onOpenChange,
  projectSlug,
  projectName,
  primaryIdKey,
  item,
}: EditEntityDialogProps) {
  const updateEntity = useEntitiesStore((state) => state.updateEntity)

  const fields = React.useMemo(() => PROJECT_FIELDS[projectSlug] || [], [projectSlug])

  const formSchema = React.useMemo(() => {
    return ENTITY_EDIT_SCHEMAS[projectSlug as ProjectSlug]
  }, [projectSlug])

  const form = useForm<FieldValues>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {},
  })

  React.useEffect(() => {
    if (item) {
      const defaults: Record<string, string> = {}
      fields.forEach((field) => {
        defaults[field.key] = String(getField(item, field.key) ?? "")
      })
      form.reset(defaults)
    } else {
      form.reset({})
    }
  }, [item, fields, form])

  const onSubmit = (values: FieldValues) => {
    if (!item) return
    try {
      updateEntity(projectSlug, primaryIdKey, String(getField(item, primaryIdKey)), values)
      toast.success(`${projectName} updated successfully`)
      onOpenChange(false)
    } catch {
      toast.error(`Failed to update ${projectName.toLowerCase()}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-104 sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Pencil className="h-4 w-4 text-primary" />
            Edit {projectName}
          </DialogTitle>
          <DialogDescription>
            Update the attributes of this record. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label htmlFor={`field-${field.key}`} className="text-xs font-semibold text-muted-foreground">
                {field.label}
              </label>

              <FormFieldInput
                field={field}
                form={form}
                idPrefix="edit-entity"
              />

              {form.formState.errors[field.key] && (
                <span className="text-destructive text-[11px] font-medium">
                  {form.formState.errors[field.key]?.message as string}
                </span>
              )}
            </div>
          ))}

          <DialogFooter className="bg-transparent border-t-0 p-0 pt-4 mx-0 mb-0 flex flex-row items-center justify-end gap-3">
            <Button
              id="edit-entity-cancel"
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="gap-1.5 h-8 px-3 text-xs"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button
              id="edit-entity-submit"
              type="submit"
              size="sm"
              className="gap-1.5 h-8 px-3 text-xs shadow-sm"
            >
              <Save className="h-3.5 w-3.5" />
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
