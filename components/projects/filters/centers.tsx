"use client"

/**
 * @file components/projects/filters/centers.tsx
 * @description Filter controls for the Centers entity table.
 */

import { Table } from "@tanstack/react-table"
import { EntityKey } from "@/lib/constants/enums"
import { useEntitiesStore } from "@/lib/store"
import { Factory } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
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
          <div className="flex items-center gap-1.5 truncate">
            <Factory className="h-3.5 w-3.5 text-muted-foreground/75 shrink-0" />
            <span className="truncate">
              {selectedFactory ? (
                <>
                  {selectedFactory.name} <span className="text-muted-foreground">(ID: {selectedFactory.id})</span>
                </>
              ) : (
                "All Factories"
              )}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            <SelectLabel>Factory</SelectLabel>
            <SelectItem value="all" className="text-xs">
              All Factories
            </SelectItem>
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
