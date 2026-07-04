"use client"

/**
 * @file components/projects/filters/rates.tsx
 * @description Filter controls for the Rates entity table.
 */

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Unit, EntityKey } from "@/lib/constants/enums"
import { fetchCommodities } from "@/lib/services"
import { getCommodityIcon } from "@/lib/fields"
import { type Commodity } from "@/types"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RatesFiltersProps<TData> {
  table: Table<TData>
}

export function RatesFilters<TData>({ table }: RatesFiltersProps<TData>) {
  const [commodities, setCommodities] = React.useState<Commodity[]>([])

  React.useEffect(() => {
    let active = true
    async function load() {
      try {
        const list = await fetchCommodities()
        if (active) {
          setCommodities(list as Commodity[])
        }
      } catch (err) {
        console.error("Failed to fetch commodities for filter:", err)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

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
    <div className="flex items-center gap-2">
      <Select
        value={currentCommodityId ? String(currentCommodityId) : "all"}
        onValueChange={(val) => setColumnFilter(EntityKey.COMMODITY_ID, val === "all" ? undefined : Number(val))}
      >
        <SelectTrigger className="h-9 text-xs bg-background shadow-sm">
          {selectedCommodity ? (
            (() => {
              const Icon = getCommodityIcon(selectedCommodity.name)
              return (
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground/75" />
                  <span>{selectedCommodity.name}</span>
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

      <Select
        value={currentUnit ? String(currentUnit) : "all"}
        onValueChange={(val) => setColumnFilter(EntityKey.UNIT, val === "all" ? undefined : val)}
      >
        <SelectTrigger className="h-9 text-xs bg-background shadow-sm">
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
    </div>
  )
}
