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
import { ProjectSlug } from "@/lib/fields"
import { centers } from "@/data/centers"
import { commodities } from "@/data/commodities"
import { customers } from "@/data/customers"
import { factories } from "@/data/factories"
import { operators } from "@/data/operators"
import { villages } from "@/data/villages"
import {
  type Center,
  type Commodity,
  type Customer,
  type Factory,
  type Operator,
  type Village,
} from "@/types"

type Entity = Center | Commodity | Customer | Factory | Operator | Village

const FALLBACK_DATA: Record<string, Entity[]> = {
  [ProjectSlug.CENTERS]: centers,
  [ProjectSlug.COMMODITIES]: commodities,
  [ProjectSlug.CUSTOMERS]: customers,
  [ProjectSlug.FACTORIES]: factories,
  [ProjectSlug.OPERATORS]: operators,
  [ProjectSlug.VILLAGES]: villages,
}

interface EntityComboboxProps {
  entitySlug: string | ProjectSlug
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
}

export function useEntityOptions(entitySlug: string | ProjectSlug) {
  const storeData = useEntitiesStore((state) => state.entities[entitySlug]) as Entity[] | undefined

  return React.useMemo(() => {
    const dataList = storeData !== undefined ? storeData : (FALLBACK_DATA[entitySlug] || [])
    return dataList.map((item) => {
      let idVal = ""
      let nameVal = ""

      if (entitySlug === ProjectSlug.CUSTOMERS) {
        const customer = item as Customer
        idVal = String(customer.govt_id ?? "")
        nameVal = customer.name
      } else if (entitySlug === ProjectSlug.OPERATORS) {
        const operator = item as Operator
        idVal = String(operator.aadhar_number ?? "")
        nameVal = operator.name
      } else if (entitySlug === ProjectSlug.CENTERS) {
        const center = item as Center
        idVal = String(center.id ?? "")
        nameVal = center.name
      } else if (entitySlug === ProjectSlug.COMMODITIES) {
        const commodity = item as Commodity
        idVal = String(commodity.id ?? "")
        nameVal = commodity.name
      } else if (entitySlug === ProjectSlug.FACTORIES) {
        const factory = item as Factory
        idVal = String(factory.id ?? "")
        nameVal = factory.name
      } else if (entitySlug === ProjectSlug.VILLAGES) {
        const village = item as Village
        idVal = String(village.id ?? "")
        nameVal = village.name
      }

      return {
        value: idVal,
        label: nameVal ? `${nameVal} (ID: ${idVal})` : idVal,
      }
    })
  }, [storeData, entitySlug])
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
