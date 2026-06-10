"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { Pencil, Save, X } from "lucide-react"

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


const EDITABLE_FIELDS: Record<
  string,
  { key: string; label: string; placeholder: string; type: "text" | "number" | "state" }[]
> = {
  centers: [
    { key: "name", label: "Center Name", placeholder: "e.g. Center F", type: "text" },
    { key: "factory_id", label: "Factory ID", placeholder: "e.g. 1", type: "text" },
  ],
  commodities: [
    { key: "name", label: "Commodity Name", placeholder: "e.g. Barley", type: "text" },
    { key: "unit_price", label: "Unit Price (INR)", placeholder: "e.g. 15000", type: "number" },
  ],
  customers: [
    { key: "name", label: "Customer Name", placeholder: "e.g. Ajay Kumar", type: "text" },
    { key: "father_name", label: "Father's Name", placeholder: "e.g. Vijay Kumar", type: "text" },
    { key: "village_id", label: "Village ID", placeholder: "e.g. 1", type: "text" },
  ],
  "data-entries": [
    { key: "vehicle_number", label: "Vehicle Number", placeholder: "e.g. PB10XY1234", type: "text" },
    { key: "weight", label: "Weight (tons)", placeholder: "e.g. 15.5", type: "number" },
    { key: "commodity_id", label: "Commodity ID", placeholder: "e.g. 1", type: "text" },
    { key: "center_id", label: "Center ID", placeholder: "e.g. 1", type: "text" },
    { key: "operator_id", label: "Operator ID", placeholder: "e.g. 123456789012", type: "text" },
    { key: "customer_id", label: "Customer ID", placeholder: "e.g. GOV1001", type: "text" },
  ],
  factories: [
    { key: "name", label: "Factory Name", placeholder: "e.g. Factory C", type: "text" },
    { key: "village_id", label: "Village ID", placeholder: "e.g. 1", type: "text" },
  ],
  operators: [
    { key: "id", label: "System ID", placeholder: "e.g. operator-id", type: "text" },
    { key: "name", label: "Operator Name", placeholder: "e.g. Amit Sharma", type: "text" },
  ],
  users: [
    { key: "email", label: "Email Address", placeholder: "e.g. user@example.com", type: "text" },
    { key: "role", label: "User Role", placeholder: "e.g. operator", type: "text" },
  ],
  villages: [
    { key: "name", label: "Village Name", placeholder: "e.g. Ludhiana", type: "text" },
    { key: "state", label: "State", placeholder: "Select state...", type: "state" },
  ],
}

interface EditEntityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectSlug: string
  projectName: string
  primaryIdKey: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any | null
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

  const form = useForm<Record<string, string>>({
    defaultValues: {},
  })

  const selectedState = useWatch({
    control: form.control,
    name: "state",
  })

  React.useEffect(() => {
    const fieldsConfig = EDITABLE_FIELDS[projectSlug] || []
    if (item) {
      const defaults: Record<string, string> = {}
      fieldsConfig.forEach((field) => {
        defaults[field.key] = String(item[field.key] ?? "")
      })
      form.reset(defaults)
    } else {
      form.reset({})
    }
  }, [item, projectSlug, form])

  const fields = EDITABLE_FIELDS[projectSlug] || []

  const onSubmit = (values: Record<string, string>) => {
    if (!item) return
    try {
      updateEntity(projectSlug, primaryIdKey, item[primaryIdKey], values)
      toast.success(`${projectName} updated successfully`)
      onOpenChange(false)
    } catch {
      toast.error(`Failed to update ${projectName.toLowerCase()}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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

              {field.type === "state" ? (
                <StateCombobox
                  id="edit-entity-state-trigger"
                  value={selectedState}
                  onChange={(val) => form.setValue("state", val, { shouldValidate: true })}
                />
              ) : (
                <Input
                  id={`field-${field.key}`}
                  type={field.type}
                  step={field.type === "number" ? "any" : undefined}
                  {...form.register(field.key, { required: `${field.label} is required` })}
                  placeholder={field.placeholder}
                  className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-primary/50 transition-shadow"
                />
              )}

              {form.formState.errors[field.key] && (
                <span className="text-destructive text-[11px] font-medium">
                  {form.formState.errors[field.key]?.message}
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
