"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Plus, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEntitiesStore } from "@/lib/store"
import { StateCombobox } from "@/components/state-combobox"
import { EntityCombobox } from "@/components/entity-combobox"
import { PROJECT_FIELDS, getReferencedEntitySlug, getFieldsSchema, FieldType } from "@/lib/fields"

interface CreateEntityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectSlug: string
  projectName: string
  primaryIdKey: string
}

export function CreateEntityDialog({
  open,
  onOpenChange,
  projectSlug,
  projectName,
  primaryIdKey,
}: CreateEntityDialogProps) {
  const addEntity = useEntitiesStore((state) => state.addEntity)

  const fields = React.useMemo(() => PROJECT_FIELDS[projectSlug] || [], [projectSlug])

  const formSchema = React.useMemo(() => getFieldsSchema(fields), [fields])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<Record<string, any>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema as any),
    defaultValues: {},
  })

  const selectedState = useWatch({
    control: form.control,
    name: "state",
  })

  React.useEffect(() => {
    if (open) {
      form.reset({})
    }
  }, [open, form])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (values: Record<string, any>) => {
    try {
      addEntity(projectSlug, primaryIdKey, values)
      toast.success(`${projectName} created successfully`)
      onOpenChange(false)
    } catch {
      toast.error(`Failed to create ${projectName.toLowerCase()}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-104 sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Plus className="h-4 w-4 text-primary" />
            Add {projectName}
          </DialogTitle>
          <DialogDescription>
            Enter the details for the new {projectName.toLowerCase()}. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label htmlFor={`field-${field.key}`} className="text-xs font-semibold text-muted-foreground">
                {field.label}
              </label>

              {field.type === FieldType.STATE ? (
                <StateCombobox
                  id="create-entity-state-trigger"
                  value={selectedState}
                  onChange={(val) => form.setValue("state", val, { shouldValidate: true })}
                />
              ) : getReferencedEntitySlug(field.key) ? (
                <EntityCombobox
                  id={`field-${field.key}`}
                  entitySlug={getReferencedEntitySlug(field.key)!}
                  value={form.watch(field.key)}
                  onChange={(val) => form.setValue(field.key, val, { shouldValidate: true })}
                  placeholder={field.placeholder}
                />
              ) : (
                <Input
                  id={`field-${field.key}`}
                  type={field.type}
                  step={field.type === FieldType.NUMBER ? "any" : undefined}
                  {...form.register(field.key)}
                  placeholder={field.placeholder}
                  className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-primary/50 transition-shadow"
                />
              )}

              {form.formState.errors[field.key] && (
                <span className="text-destructive text-[11px] font-medium">
                  {form.formState.errors[field.key]?.message as string}
                </span>
              )}
            </div>
          ))}

          <DialogFooter className="bg-transparent border-t-0 p-0 pt-4 mx-0 mb-0 flex flex-row items-center justify-end gap-3">
            <Button
              id="create-entity-cancel"
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
              id="create-entity-submit"
              type="submit"
              size="sm"
              className="gap-1.5 h-8 px-3 text-xs shadow-sm"
            >
              <Save className="h-3.5 w-3.5" />
              Save {projectName}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
