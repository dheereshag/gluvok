"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import * as z from "zod"
import { ChevronsUpDown } from "lucide-react"

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
          <DialogTitle>Edit Village</DialogTitle>
          <DialogDescription>
            Update the name or state of the village. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-xs font-semibold text-muted-foreground">
              Village Name
            </label>
            <Input
              id="name"
              {...form.register("name")}
              className="h-9 text-xs focus-visible:ring-1 focus-visible:ring-primary/50"
            />
            {form.formState.errors.name && (
              <span className="text-destructive text-[11px]">
                {form.formState.errors.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground">
              State
            </label>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isPopoverOpen}
                  className="h-9 w-full justify-between text-xs font-normal"
                >
                  {selectedState
                    ? STATES.find((state) => state.value === selectedState)?.label || selectedState
                    : "Select state..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[370px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search state..." className="h-8" />
                  <CommandList>
                    <CommandEmpty>No state found.</CommandEmpty>
                    <CommandGroup>
                      {STATES.map((state) => (
                        <CommandItem
                          key={state.value}
                          value={state.value}
                          onSelect={() => {
                            form.setValue("state", state.value)
                            setIsPopoverOpen(false)
                          }}
                        >
                          {state.label} ({state.value})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {form.formState.errors.state && (
              <span className="text-destructive text-[11px]">
                {form.formState.errors.state.message}
              </span>
            )}
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
