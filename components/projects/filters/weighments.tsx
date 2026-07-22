"use client"

/**
 * @file components/projects/filters/weighments.tsx
 * @description Filter controls for the Weighments entity table.
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
import { Field, FieldLabel } from "@/components/ui/field"
import { DateRangeFilter } from "./date-range-filter"

interface WeighmentsFiltersProps<TData> {
  table: Table<TData>
}

function useWeighmentsFilterData() {
  const weighmentFiltersData = useEntitiesStore((state) => state.weighmentFiltersData)

  return {
    centers: weighmentFiltersData?.centers || [],
    profiles: weighmentFiltersData?.profiles || [],
    customers: weighmentFiltersData?.customers || [],
    rates: weighmentFiltersData?.rates || [],
  }
}

export function WeighmentsFilters<TData>({ table }: WeighmentsFiltersProps<TData>) {
  const { centers, profiles, customers, rates } = useWeighmentsFilterData()

  const columnFilters = table.getState().columnFilters
  const currentRateId = columnFilters.find((f) => f.id === EntityKey.RATE_ID)?.value
  const currentCenterId = columnFilters.find((f) => f.id === EntityKey.CENTER_ID)?.value
  const currentCustomerId = columnFilters.find((f) => f.id === EntityKey.CUSTOMER_ID)?.value
  const currentProfileId = columnFilters.find((f) => f.id === EntityKey.PROFILE_ID)?.value

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

      {/* Rate */}
      <Field className="w-36">
        <FieldLabel className="text-xs font-medium text-muted-foreground mb-1">Rate</FieldLabel>
        <Select
          value={currentRateId ? String(currentRateId) : "all"}
          onValueChange={(val) => setColumnFilter(EntityKey.RATE_ID, val === "all" ? undefined : Number(val))}
        >
          <SelectTrigger className="h-9 text-xs bg-background shadow-sm w-full">
            <SelectValue placeholder="All Rates" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Rate</SelectLabel>
              <SelectItem value="all" className="text-xs">All Rates</SelectItem>
              {rates.map((r) => (
                <SelectItem key={r.id} value={String(r.id)} className="text-xs">{r.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      {/* Center */}
      <Field className="w-40">
        <FieldLabel className="text-xs font-medium text-muted-foreground mb-1">Center</FieldLabel>
        <Select
          value={currentCenterId ? String(currentCenterId) : "all"}
          onValueChange={(val) => setColumnFilter(EntityKey.CENTER_ID, val === "all" ? undefined : Number(val))}
        >
          <SelectTrigger className="h-9 text-xs bg-background shadow-sm w-full">
            <SelectValue placeholder="All Centers" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Center</SelectLabel>
              <SelectItem value="all" className="text-xs">All Centers</SelectItem>
              {centers.map((c) => (
                <SelectItem key={c.id} value={String(c.id)} className="text-xs">
                  {c.name} <span className="text-muted-foreground">(ID: {c.id})</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      {/* Customer */}
      <Field className="w-40">
        <FieldLabel className="text-xs font-medium text-muted-foreground mb-1">Customer</FieldLabel>
        <Select
          value={currentCustomerId ? String(currentCustomerId) : "all"}
          onValueChange={(val) => setColumnFilter(EntityKey.CUSTOMER_ID, val === "all" ? undefined : Number(val))}
        >
          <SelectTrigger className="h-9 text-xs bg-background shadow-sm w-full">
            <SelectValue placeholder="All Customers" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Customer</SelectLabel>
              <SelectItem value="all" className="text-xs">All Customers</SelectItem>
              {customers.map((c) => (
                <SelectItem key={c.id} value={String(c.id)} className="text-xs">
                  {c.name} <span className="text-muted-foreground">(ID: {c.id})</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      {/* Profile */}
      <Field className="w-40">
        <FieldLabel className="text-xs font-medium text-muted-foreground mb-1">Profile</FieldLabel>
        <Select
          value={currentProfileId ? String(currentProfileId) : "all"}
          onValueChange={(val) => setColumnFilter(EntityKey.PROFILE_ID, val === "all" ? undefined : Number(val))}
        >
          <SelectTrigger className="h-9 text-xs bg-background shadow-sm w-full">
            <SelectValue placeholder="All Profiles" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Profile</SelectLabel>
              <SelectItem value="all" className="text-xs">All Profiles</SelectItem>
              {profiles.map((p) => (
                <SelectItem key={p.id} value={String(p.id)} className="text-xs">
                  {p.name} <span className="text-muted-foreground">(ID: {p.id})</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  )
}



