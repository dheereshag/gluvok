"use client"

import * as React from "react"
import { ChevronsUpDown, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { STATES } from "@/data/states"

interface StateComboboxProps {
  value: string
  onChange: (value: string) => void
  id?: string
}

export function StateCombobox({ value, onChange, id }: StateComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id || "state-combobox-trigger"}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-9 w-full justify-between text-xs font-normal border border-input bg-background hover:bg-muted/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            {value
              ? STATES.find((s) => s.value === value)?.label || value
              : "Select state..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ width: "var(--radix-popover-trigger-width)" }}
        className="p-0"
        align="start"
      >
        <Command className="max-h-[300px]">
          <CommandInput placeholder="Search state..." className="h-9 text-xs" />
          <CommandList className="max-h-[250px] overflow-y-auto">
            <CommandEmpty className="py-2 text-center text-xs text-muted-foreground">
              No state found.
            </CommandEmpty>
            <CommandGroup>
              {STATES.map((s) => (
                <CommandItem
                  key={s.value}
                  id={`state-option-${s.value}`}
                  value={`${s.label.toLowerCase()} ${s.value.toLowerCase()}`}
                  onSelect={() => {
                    onChange(s.value)
                    setOpen(false)
                  }}
                  className="text-xs cursor-pointer py-2 hover:bg-muted transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-foreground">{s.label}</span>
                  <span className="text-[10px] text-muted-foreground font-semibold bg-muted px-1.5 py-0.5 rounded">
                    {s.value}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
