"use client"

import * as React from "react"
import { ChevronsUpDown, Check, LucideIcon } from "lucide-react"
import { Combobox, ComboboxTrigger, ComboboxContent, ComboboxInput, ComboboxList, ComboboxEmpty, ComboboxGroup, ComboboxItem } from "@/components/kibo-ui/combobox"

export interface ComboboxOption {
  value: string
  label: string
  rightLabel?: string
}

interface BaseComboboxProps {
  value: string
  onChange: (value: string) => void
  data: ComboboxOption[]
  type: string
  icon?: LucideIcon
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  id?: string
}

export function BaseCombobox({
  value,
  onChange,
  data,
  type,
  icon: Icon,
  placeholder,
  searchPlaceholder,
  emptyText,
  id,
}: BaseComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const selectedItem = React.useMemo(() => {
    return data.find((item) => String(item.value) === String(value))
  }, [data, value])

  return (
    <Combobox data={data} type={type} value={value} onValueChange={onChange} open={open} onOpenChange={setOpen} modal={true}>
      <ComboboxTrigger
        id={id || `${type}-combobox-trigger`}
        className="h-9 w-full justify-between text-xs font-normal border border-input bg-background hover:bg-muted/50 transition-colors min-w-0"
      >
        <span className="flex items-center gap-2 truncate text-left flex-1 min-w-0">
          {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
          <span className="truncate">{selectedItem ? selectedItem.label : placeholder || `Select ${type}...`}</span>
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </ComboboxTrigger>
      <ComboboxContent className="max-h-72">
        <ComboboxInput placeholder={searchPlaceholder || `Search ${type}...`} className="h-9 text-xs" />
        <ComboboxList className="max-h-[250px] overflow-y-auto">
          <ComboboxEmpty className="py-2 text-center text-xs text-muted-foreground">{emptyText || `No ${type} found.`}</ComboboxEmpty>
          <ComboboxGroup>
            {data.map((item) => (
              <ComboboxItem
                key={item.value}
                id={`${type}-option-${item.value}`}
                value={`${item.label.toLowerCase()} ${item.value.toLowerCase()} ${item.rightLabel ? item.rightLabel.toLowerCase() : ""}`}
                onSelect={() => { onChange(item.value); setOpen(false); }}
                className="text-xs cursor-pointer py-2 hover:bg-muted transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-foreground">{item.label}</span>
                {item.rightLabel && (
                  <span className="text-[10px] text-muted-foreground font-semibold bg-muted px-1.5 py-0.5 rounded">{item.rightLabel}</span>
                )}
                {String(value) === String(item.value) && !item.rightLabel && (
                  <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-2" />
                )}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
