"use client"

/**
 * @file components/projects/filters/centers.tsx
 * @description Filter controls for the Centers entity table.
 */

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { EntityKey } from "@/lib/constants/enums"
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

interface CentersFiltersProps<TData> {
  table: Table<TData>
}

export function CentersFilters<TData>({ table }: CentersFiltersProps<TData>) {
  const factories = useEntitiesStore((state) => state.factories)

  const columnFilters = table.getState().columnFilters
  const currentFactoryId = columnFilters.find((f) => f.id === EntityKey.FACTORY_ID)?.value

  const selectedFactory = factories.find((f) => f.id === Number(currentFactoryId))

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
        value={currentFactoryId ? String(currentFactoryId) : "all"}
        onValueChange={(val) =>
          setColumnFilter(EntityKey.FACTORY_ID, val === "all" ? undefined : Number(val))
        }
      >
        <SelectTrigger className="h-9 text-xs bg-background shadow-sm">
          {selectedFactory ? (
            <span>{selectedFactory.name} <span className="text-muted-foreground">(ID: {selectedFactory.id})</span></span>
          ) : (
            <SelectValue placeholder="All Factories" />
          )}
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            <SelectLabel>Factory</SelectLabel>
            <SelectItem value="all" className="text-xs">All Factories</SelectItem>
            {factories.map((f) => (
              <SelectItem key={f.id} value={String(f.id)} className="text-xs">
                {f.name} <span className="text-muted-foreground ml-1">(ID: {f.id})</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
