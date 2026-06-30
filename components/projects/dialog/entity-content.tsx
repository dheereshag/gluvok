"use client"

import { Pencil, Plus, Save, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormFieldInput } from "@/components/form"
import { type EntityDialogContentProps } from "./types"
import { FieldType, ProjectSlug, EntityKey } from "@/lib/constants/enums"
import { isPrimaryKeyEditable } from "@/lib/fields"
import { useAuthStore } from "@/lib/store"
import { Role } from "@/lib/constants/enums"

export function EntityDialogContent({
  mode, onOpenChange, projectName, projectSlug, isEdit, fields, form, onSubmit, primaryIdKey
}: EntityDialogContentProps) {
  const currentUser = useAuthStore((state) => state.user)
  const isSuperAdmin = currentUser?.role === Role.SUPER_ADMIN
  const Icon = isEdit ? Pencil : Plus
  const desc = isEdit
    ? "Update the attributes of this record. Click save when done."
    : `Enter the details for the new ${projectName.toLowerCase()}. Click save when done.`

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-foreground">
          <Icon className="h-4 w-4 text-primary" /> {isEdit ? "Edit" : "Add"} {projectName}
        </DialogTitle>
        <DialogDescription>{desc}</DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        {fields.map((field) => {
          const isFieldVisible = (() => {
            switch (projectSlug as ProjectSlug) {
              case ProjectSlug.WEIGHMENTS:
                switch (field.key) {
                  case EntityKey.PROFILE_ID:
                    switch (currentUser?.role) {
                      case Role.SUPER_ADMIN:
                      case Role.ADMIN:
                        return true
                      default:
                        return false
                    }
                  default:
                    return true
                }
              default:
                return true
            }
          })()

          switch (isFieldVisible) {
            case false:
              return null
            default:
              break
          }

          const disabled = (isEdit && field.key === primaryIdKey && !isPrimaryKeyEditable(projectSlug) && !isSuperAdmin) ||
                           (field.key === EntityKey.FACTORY_ID && !isSuperAdmin)

          switch (field.type) {
            case FieldType.CHECKBOX:
              return (
                <div key={field.key} className="flex items-center gap-2 py-1">
                  <FormFieldInput
                    field={field}
                    form={form}
                    idPrefix={`${mode}-entity`}
                    disabled={disabled}
                    projectSlug={projectSlug}
                  />
                  <label htmlFor={`${mode}-entity-field-${field.key}`} className="text-xs font-semibold text-muted-foreground cursor-pointer select-none flex items-center gap-1.5">
                    {field.icon && <field.icon className="h-3.5 w-3.5 text-muted-foreground/75" />}
                    {field.label}
                  </label>
                  {form.formState.errors[field.key] && (
                    <span className="text-destructive text-[11px] font-medium ml-2">{form.formState.errors[field.key]?.message as string}</span>
                  )}
                </div>
              )
            default:
              return (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label htmlFor={`field-${field.key}`} className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    {field.icon && <field.icon className="h-3.5 w-3.5 text-muted-foreground/75" />}
                    {field.label}
                  </label>
                  <FormFieldInput
                    field={field}
                    form={form}
                    idPrefix={`${mode}-entity`}
                    disabled={disabled}
                    projectSlug={projectSlug}
                  />
                  {form.formState.errors[field.key] && (
                    <span className="text-destructive text-[11px] font-medium">{form.formState.errors[field.key]?.message as string}</span>
                  )}
                </div>
              )
          }
        })}
        <DialogFooter className="bg-transparent border-t-0 p-0 pt-4 mx-0 mb-0 flex flex-row items-center justify-end gap-3">
          <Button id={`${mode}-entity-cancel`} type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="gap-1.5 h-8 px-3 text-xs" disabled={form.formState.isSubmitting}>
            <X className="h-3.5 w-3.5" /> Cancel
          </Button>
          <Button id={`${mode}-entity-submit`} type="submit" size="sm" className="gap-1.5 h-8 px-3 text-xs shadow-sm" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {form.formState.isSubmitting ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save changes" : `Save ${projectName}`)}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}
