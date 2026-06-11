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

function getReferencedEntitySlug(key: string): string | null {
  if (key === "factory_id") return "factories"
  if (key === "village_id") return "villages"
  if (key === "commodity_id") return "commodities"
  if (key === "center_id") return "centers"
  if (key === "operator_id") return "operators"
  if (key === "customer_id") return "customers"
  return null
}

const CREATABLE_FIELDS: Record<
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

  const fields = React.useMemo(() => CREATABLE_FIELDS[projectSlug] || [], [projectSlug])

  const formSchema = React.useMemo(() => {
    const schemaShape: Record<string, z.ZodTypeAny> = {}
    fields.forEach((f) => {
      if (f.type === "number") {
        schemaShape[f.key] = z.coerce.number()
      } else {
        schemaShape[f.key] = z.string().min(1, `${f.label} is required`)
      }
    })
    return z.object(schemaShape)
  }, [fields])

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

              {field.type === "state" ? (
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
                  step={field.type === "number" ? "any" : undefined}
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
