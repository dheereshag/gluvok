"use client"

/**
 * @file components/projects/filters/rates.tsx
 * @description Filter controls for the Rates entity table.
 */

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Unit, EntityKey } from "@/lib/constants/enums"
import { useEntitiesStore } from "@/lib/store"
import { Package, Ruler } from "lucide-react"
import { BaseCombobox } from "@/components/combobox/base"
import { DateRangeFilter } from "./date-range-filter"

interface RatesFiltersProps<TData> {
  table: Table<TData>
}

export function RatesFilters<TData>({ table }: RatesFiltersProps<TData>) {
  const commodities = useEntitiesStore((state) => state.commodities)

  const columnFilters = table.getState().columnFilters
  const currentCommodityId = columnFilters.find((f) => f.id === EntityKey.COMMODITY_ID)?.value
  const currentUnit = columnFilters.find((f) => f.id === EntityKey.UNIT)?.value

  const setColumnFilter = (id: string, value: unknown) => {
    table.setColumnFilters((prev) => {
      const filtered = prev.filter((f) => f.id !== id)
      if (value !== undefined && value !== null && value !== "") {
        return [...filtered, { id, value }]
      }
      return filtered
    })
  }

  const commodityOptions = React.useMemo(() => {
    return [
      { value: "all", label: "All Commodities" },
      ...commodities.map((c) => ({
        value: String(c.id),
        label: c.name,
      })),
    ]
  }, [commodities])

  const unitOptions = React.useMemo(() => {
    return [
      { value: "all", label: "All Units" },
      ...Object.values(Unit).map((u) => ({
        value: u,
        label: u,
      })),
    ]
  }, [])

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Date Range */}
      <DateRangeFilter table={table} />

      {/* Commodity */}
      <BaseCombobox
        type="commodities"
        value={currentCommodityId ? String(currentCommodityId) : "all"}
        onChange={(val) => setColumnFilter(EntityKey.COMMODITY_ID, val === "all" ? undefined : Number(val))}
        data={commodityOptions}
        placeholder="All Commodities"
        searchPlaceholder="Search commodity..."
        icon={Package}
        className="w-auto"
        id="filter-commodity-combobox"
      />

      {/* Unit */}
      <BaseCombobox
        type="unit"
        value={currentUnit ? String(currentUnit) : "all"}
        onChange={(val) => setColumnFilter(EntityKey.UNIT, val === "all" ? undefined : val)}
        data={unitOptions}
        placeholder="All Units"
        searchPlaceholder="Search unit..."
        icon={Ruler}
        className="w-auto"
        id="filter-unit-combobox"
      />
    </div>
  )
}
