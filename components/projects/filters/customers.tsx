"use client"

/**
 * @file components/projects/filters/customers.tsx
 * @description Filter controls for the Customers entity table.
 */

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { EntityKey } from "@/lib/constants/enums"
import { supabase } from "@/lib/supabase"
import { useEntitiesStore } from "@/lib/store"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Village { id: number; name: string }

interface CustomersFiltersProps<TData> {
  table: Table<TData>
}

export function CustomersFilters<TData>({ table }: CustomersFiltersProps<TData>) {
  const [villages, setVillages] = React.useState<Village[]>([])
  const setFiltersLoading = useEntitiesStore((state) => state.setFiltersLoading)

  React.useEffect(() => {
    let active = true
    setFiltersLoading("customers", true)
    supabase.from("villages").select("id, name").order("name").then(({ data }) => {
      if (active) {
        setVillages((data as Village[]) || [])
        setFiltersLoading("customers", false)
      }
    })
    return () => {
      active = false
      setFiltersLoading("customers", false)
    }
  }, [setFiltersLoading])

  const columnFilters = table.getState().columnFilters
  const currentVillageId = columnFilters.find((f) => f.id === EntityKey.VILLAGE_ID)?.value

  const selectedVillage = villages.find((v) => v.id === Number(currentVillageId))

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
        value={currentVillageId ? String(currentVillageId) : "all"}
        onValueChange={(val) =>
          setColumnFilter(EntityKey.VILLAGE_ID, val === "all" ? undefined : Number(val))
        }
      >
        <SelectTrigger className="h-9 text-xs bg-background shadow-sm">
          {selectedVillage ? (
            <span>{selectedVillage.name} <span className="text-muted-foreground">(ID: {selectedVillage.id})</span></span>
          ) : (
            <SelectValue placeholder="All Villages" />
          )}
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            <SelectLabel>Village</SelectLabel>
            <SelectItem value="all" className="text-xs">All Villages</SelectItem>
            {villages.map((v) => (
              <SelectItem key={v.id} value={String(v.id)} className="text-xs">
                {v.name} <span className="text-muted-foreground ml-1">(ID: {v.id})</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
