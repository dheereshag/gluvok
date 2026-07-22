"use client"

/**
 * @file components/projects/filters/rates.tsx
 * @description Filter controls for the Rates entity table.
 */

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Unit, EntityKey } from "@/lib/constants/enums"
import { useEntitiesStore } from "@/lib/store"
import { getCommodityIcon } from "@/lib/fields"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"
import { DateRangeFilter } from "./date-range-filter"

interface RatesFiltersProps<TData> {
  table: Table<TData>
}

export function RatesFilters<TData>({ table }: RatesFiltersProps<TData>) {
  const commodities = useEntitiesStore((state) => state.commodities)

  const columnFilters = table.getState().columnFilters
  const currentCommodityId = columnFilters.find((f) => f.id === EntityKey.COMMODITY_ID)?.value
  const currentUnit = columnFilters.find((f) => f.id === EntityKey.UNIT)?.value

  const selectedCommodity = commodities.find((c) => c.id === Number(currentCommodityId))

  const setColumnFilter = (id: string, value: unknown) => {
    table.setColumnFilters((prev) => {
      const filtered = prev.filter((f) => f.id !== id)
      if (value !== undefined && value !== null && value !== "") {
        return [...filtered, { id, value }]
      }
      return filtered
    })
  }

  return (
    <div className="flex items-end gap-3 flex-wrap">
      {/* Date Range */}
      <DateRangeFilter table={table} />

      {/* Commodity */}
      <Field className="w-44">
        <FieldLabel className="text-xs font-medium text-muted-foreground mb-1">Commodity</FieldLabel>
        <Select
          value={currentCommodityId ? String(currentCommodityId) : "all"}
          onValueChange={(val) => setColumnFilter(EntityKey.COMMODITY_ID, val === "all" ? undefined : Number(val))}
        >
          <SelectTrigger className="h-9 text-xs bg-background shadow-sm w-full">
            {selectedCommodity ? (
              (() => {
                const Icon = getCommodityIcon(selectedCommodity.name)
                return (
                  <div className="flex items-center gap-1.5 truncate">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground/75 shrink-0" />
                    <span className="truncate">{selectedCommodity.name}</span>
                  </div>
                )
              })()
            ) : (
              <SelectValue placeholder="All Commodities" />
            )}
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Commodity</SelectLabel>
              <SelectItem value="all" className="text-xs">All Commodities</SelectItem>
              {commodities.map((c) => {
                const Icon = getCommodityIcon(c.name)
                return (
                  <SelectItem key={c.id} value={String(c.id)} className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground/75" />
                      <span>{c.name}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      {/* Unit */}
      <Field className="w-32">
        <FieldLabel className="text-xs font-medium text-muted-foreground mb-1">Unit</FieldLabel>
        <Select
          value={currentUnit ? String(currentUnit) : "all"}
          onValueChange={(val) => setColumnFilter(EntityKey.UNIT, val === "all" ? undefined : val)}
        >
          <SelectTrigger className="h-9 text-xs bg-background shadow-sm w-full">
            <SelectValue placeholder="All Units" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Unit</SelectLabel>
              <SelectItem value="all" className="text-xs">All Units</SelectItem>
              {Object.values(Unit).map((u) => (
                <SelectItem key={u} value={u} className="text-xs">
                  {u}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  )
}

