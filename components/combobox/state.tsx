"use client"

import * as React from "react"
import { ChevronsUpDown, MapPin } from "lucide-react"
import { Combobox, ComboboxTrigger, ComboboxContent, ComboboxInput, ComboboxList, ComboboxEmpty, ComboboxGroup, ComboboxItem } from "@/components/kibo-ui/combobox"
import { STATES_DATA } from "./states-data"

interface StateComboboxProps {
  value: string
  onChange: (value: string) => void
  id?: string
}

export function StateCombobox({ value, onChange, id }: StateComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Combobox data={STATES_DATA} type="state" value={value} onValueChange={onChange} open={open} onOpenChange={setOpen} modal={true}>
      <ComboboxTrigger
        id={id || "state-combobox-trigger"}
        className="h-9 w-full justify-between text-xs font-normal border border-input bg-background hover:bg-muted/50 transition-colors min-w-0"
      >
        <span className="flex items-center gap-2 truncate text-left flex-1 min-w-0">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="truncate">{value ? value : "Select state..."}</span>
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </ComboboxTrigger>
      <ComboboxContent className="max-h-72">
        <ComboboxInput placeholder="Search state..." className="h-9 text-xs" />
        <ComboboxList className="max-h-[250px] overflow-y-auto">
          <ComboboxEmpty className="py-2 text-center text-xs text-muted-foreground">No state found.</ComboboxEmpty>
          <ComboboxGroup>
            {STATES_DATA.map((s) => (
              <ComboboxItem
                key={s.value}
                id={`state-option-${s.code}`}
                value={`${s.label.toLowerCase()} ${s.code.toLowerCase()}`}
                onSelect={() => { onChange(s.value); setOpen(false); }}
                className="text-xs cursor-pointer py-2 hover:bg-muted transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-foreground">{s.label}</span>
                <span className="text-[10px] text-muted-foreground font-semibold bg-muted px-1.5 py-0.5 rounded">{s.code}</span>
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
