"use client"

import * as React from "react"
import { ChevronsUpDown, MapPin } from "lucide-react"

import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
} from "@/components/kibo-ui/combobox"
import { STATES } from "@/data/states"

interface StateComboboxProps {
  value: string
  onChange: (value: string) => void
  id?: string
}

export function StateCombobox({ value, onChange, id }: StateComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const comboboxData = React.useMemo(() => {
    return STATES.map((s) => ({
      label: s.label,
      value: s.value,
    }))
  }, [])

  return (
    <Combobox
      data={comboboxData}
      type="state"
      value={value}
      onValueChange={onChange}
      open={open}
      onOpenChange={setOpen}
      modal={true}
    >
      <ComboboxTrigger
        id={id || "state-combobox-trigger"}
        className="h-9 w-full justify-between text-xs font-normal border border-input bg-background hover:bg-muted/50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          {value
            ? STATES.find((s) => s.value === value)?.label || value
            : "Select state..."}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </ComboboxTrigger>
      <ComboboxContent
        className="max-h-72"
      >
        <ComboboxInput placeholder="Search state..." className="h-9 text-xs" />
        <ComboboxList className="max-h-[250px] overflow-y-auto">
          <ComboboxEmpty className="py-2 text-center text-xs text-muted-foreground">
            No state found.
          </ComboboxEmpty>
          <ComboboxGroup>
            {STATES.map((s) => (
              <ComboboxItem
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
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
