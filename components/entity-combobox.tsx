"use client"

import * as React from "react"
import { ChevronsUpDown, Check } from "lucide-react"
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
import { useEntitiesStore } from "@/lib/store"
import { getPrimaryIdKey, ProjectSlug } from "@/lib/fields"
import { centers } from "@/data/centers"
import { commodities } from "@/data/commodities"
import { customers } from "@/data/customers"
import { factories } from "@/data/factories"
import { operators } from "@/data/operators"
import { villages } from "@/data/villages"

const FALLBACK_DATA: Record<string, Record<string, unknown>[]> = {
  [ProjectSlug.CENTERS]: centers as unknown as Record<string, unknown>[],
  [ProjectSlug.COMMODITIES]: commodities as unknown as Record<string, unknown>[],
  [ProjectSlug.CUSTOMERS]: customers as unknown as Record<string, unknown>[],
  [ProjectSlug.FACTORIES]: factories as unknown as Record<string, unknown>[],
  [ProjectSlug.OPERATORS]: operators as unknown as Record<string, unknown>[],
  [ProjectSlug.VILLAGES]: villages as unknown as Record<string, unknown>[],
}

interface EntityComboboxProps {
  entitySlug: string | ProjectSlug
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
}

export function useEntityOptions(entitySlug: string | ProjectSlug) {
  const storeData = useEntitiesStore((state) => state.entities[entitySlug])
  const primaryIdKey = getPrimaryIdKey(entitySlug)

  return React.useMemo(() => {
    const dataList = storeData !== undefined ? storeData : (FALLBACK_DATA[entitySlug] || [])
    return dataList.map((item) => {
      const idVal = String(item[primaryIdKey as keyof typeof item] ?? "")
      const nameVal = String(item.name || item.email || "")
      return {
        value: idVal,
        label: nameVal ? `${nameVal} (ID: ${idVal})` : idVal,
      }
    })
  }, [storeData, entitySlug, primaryIdKey])
}

export function EntityCombobox({
  entitySlug,
  value,
  onChange,
  placeholder,
  id,
}: EntityComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const comboboxData = useEntityOptions(entitySlug)

  const selectedItem = React.useMemo(() => {
    return comboboxData.find((item) => String(item.value) === String(value))
  }, [comboboxData, value])

  return (
    <Combobox
      data={comboboxData}
      type={entitySlug}
      value={value}
      onValueChange={onChange}
      open={open}
      onOpenChange={setOpen}
      modal={true}
    >
      <ComboboxTrigger
        id={id || `entity-combobox-trigger-${entitySlug}`}
        className="h-9 w-full justify-between text-xs font-normal border border-input bg-background hover:bg-muted/50 transition-colors"
      >
        <span className="truncate">
          {selectedItem ? selectedItem.label : placeholder || `Select ${entitySlug.slice(0, -1)}...`}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </ComboboxTrigger>
      <ComboboxContent className="max-h-72">
        <ComboboxInput placeholder={`Search ${entitySlug}...`} className="h-9 text-xs" />
        <ComboboxList className="max-h-[250px] overflow-y-auto">
          <ComboboxEmpty className="py-2 text-center text-xs text-muted-foreground">
            No {entitySlug} found.
          </ComboboxEmpty>
          <ComboboxGroup>
            {comboboxData.map((item) => (
              <ComboboxItem
                key={item.value}
                id={`entity-option-${entitySlug}-${item.value}`}
                value={`${item.label.toLowerCase()} ${item.value.toLowerCase()}`}
                onSelect={() => {
                  onChange(item.value)
                  setOpen(false)
                }}
                className="text-xs cursor-pointer py-2 hover:bg-muted transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-foreground">{item.label}</span>
                {String(value) === String(item.value) && (
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
