"use client"

import * as React from "react"
import { ChevronsUpDown, Check } from "lucide-react"
import { Combobox, ComboboxTrigger, ComboboxContent, ComboboxInput, ComboboxList, ComboboxEmpty, ComboboxGroup, ComboboxItem } from "@/components/kibo-ui/combobox"
import { useEntityOptions } from "./use-entity-options"

interface EntityComboboxProps {
  entitySlug: string; value: string; onChange: (value: string) => void; placeholder?: string; id?: string
}

export function EntityCombobox({
  entitySlug, value, onChange, placeholder, id,
}: EntityComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const comboboxData = useEntityOptions(entitySlug)
  const selectedItem = React.useMemo(() => {
    return comboboxData.find((item) => String(item.value) === String(value))
  }, [comboboxData, value])

  return (
    <Combobox data={comboboxData} type={entitySlug} value={value} onValueChange={onChange} open={open} onOpenChange={setOpen} modal={true}>
      <ComboboxTrigger
        id={id || `entity-combobox-trigger-${entitySlug}`}
        className="h-9 w-full justify-between text-xs font-normal border border-input bg-background hover:bg-muted/50 transition-colors min-w-0"
      >
        <span className="truncate text-left flex-1 min-w-0">{selectedItem ? selectedItem.label : placeholder || `Select ${entitySlug.slice(0, -1)}...`}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </ComboboxTrigger>
      <ComboboxContent className="max-h-72">
        <ComboboxInput placeholder={`Search ${entitySlug}...`} className="h-9 text-xs" />
        <ComboboxList className="max-h-[250px] overflow-y-auto">
          <ComboboxEmpty className="py-2 text-center text-xs text-muted-foreground">No {entitySlug} found.</ComboboxEmpty>
          <ComboboxGroup>
            {comboboxData.map((item) => (
              <ComboboxItem
                key={item.value}
                id={`entity-option-${entitySlug}-${item.value}`}
                value={`${item.label.toLowerCase()} ${item.value.toLowerCase()}`}
                onSelect={() => { onChange(item.value); setOpen(false); }}
                className="text-xs cursor-pointer py-2 hover:bg-muted transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-foreground">{item.label}</span>
                {String(value) === String(item.value) && <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-2" />}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
