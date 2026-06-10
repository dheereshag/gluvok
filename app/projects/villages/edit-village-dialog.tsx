"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import * as z from "zod"
import { ChevronsUpDown, Pencil, MapPin, Save, X } from "lucide-react"

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Village } from "@/data/villages"
import { useVillagesStore } from "./store"

const STATES = [
  { value: "PB", label: "Punjab" },
  { value: "RJ", label: "Rajasthan" },
  { value: "HR", label: "Haryana" },
  { value: "DL", label: "Delhi" },
  { value: "UP", label: "Uttar Pradesh" },
  { value: "MH", label: "Maharashtra" },
  { value: "KA", label: "Karnataka" },
  { value: "TN", label: "Tamil Nadu" },
  { value: "GJ", label: "Gujarat" },
] as const

const editSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  state: z.string().min(1, "State is required"),
})

type EditFormValues = z.infer<typeof editSchema>

interface EditVillageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  village: Village | null
}

export function EditVillageDialog({ open, onOpenChange, village }: EditVillageDialogProps) {
  const updateVillage = useVillagesStore((state) => state.updateVillage)
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  const form = useForm<EditFormValues>({
    resolver: standardSchemaResolver(editSchema),
    defaultValues: {
      name: "",
      state: "",
    },
  })

  const selectedState = useWatch({
    control: form.control,
    name: "state",
  })

  React.useEffect(() => {
    if (village) {
      form.reset({
        name: village.name,
        state: village.state,
      })
    } else {
      form.reset({
        name: "",
        state: "",
      })
    }
  }, [village, form])

  const onSubmit = (values: EditFormValues) => {
    if (!village) return
    try {
      updateVillage(village.id, values.name, values.state)
      toast.success("Village updated successfully")
      onOpenChange(false)
    } catch {
      toast.error("Failed to update village")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Pencil className="h-4 w-4 text-primary" />
            Edit Village
          </DialogTitle>
          <DialogDescription>
            Update the name or state of the village. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-village-name" className="text-xs font-semibold text-muted-foreground">
              Village Name
            </label>
            <Input
              id="edit-village-name"
              {...form.register("name")}
              placeholder="e.g. Ludhiana"
              className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-primary/50 transition-shadow"
            />
            {form.formState.errors.name && (
              <span className="text-destructive text-[11px] font-medium">
                {form.formState.errors.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-village-state-trigger" className="text-xs font-semibold text-muted-foreground">
              State
            </label>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="edit-village-state-trigger"
                  variant="outline"
                  role="combobox"
                  aria-expanded={isPopoverOpen}
                  className="h-9 w-full justify-between text-xs font-normal border border-input bg-background hover:bg-muted/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {selectedState
                      ? STATES.find((state) => state.value === selectedState)?.label || selectedState
                      : "Select state..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command className="max-h-[220px]">
                  <CommandInput placeholder="Search state..." className="h-9 text-xs" />
                  <CommandList className="max-h-[170px] overflow-y-auto">
                    <CommandEmpty className="py-2 text-center text-xs text-muted-foreground">No state found.</CommandEmpty>
                    <CommandGroup>
                      {STATES.map((state) => (
                        <CommandItem
                          key={state.value}
                          id={`edit-village-state-option-${state.value}`}
                          value={state.label}
                          onSelect={() => {
                            form.setValue("state", state.value, { shouldValidate: true })
                            setIsPopoverOpen(false)
                          }}
                          className="text-xs cursor-pointer py-2 hover:bg-muted transition-colors flex items-center justify-between"
                        >
                          <span className="font-medium text-foreground">{state.label}</span>
                          <span className="text-[10px] text-muted-foreground font-semibold bg-muted px-1.5 py-0.5 rounded">
                            {state.value}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {form.formState.errors.state && (
              <span className="text-destructive text-[11px] font-medium">
                {form.formState.errors.state.message}
              </span>
            )}
          </div>
          <DialogFooter className="bg-transparent border-t-0 p-0 pt-4 mx-0 mb-0 flex flex-row items-center justify-end gap-3">
            <Button
              id="edit-village-cancel"
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
              id="edit-village-submit"
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
