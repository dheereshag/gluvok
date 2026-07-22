"use client"

/**
 * @file components/projects/filters/weighments.tsx
 * @description Filter controls for the Weighments entity table including Start Date & End Date date pickers.
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
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon, X } from "lucide-react"

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
  const currentStartDateVal = columnFilters.find((f) => f.id === "start_date")?.value as string | undefined
  const currentEndDateVal = columnFilters.find((f) => f.id === "end_date")?.value as string | undefined

  const startDate = currentStartDateVal ? new Date(currentStartDateVal) : undefined
  const endDate = currentEndDateVal ? new Date(currentEndDateVal) : undefined

  const [startOpen, setStartOpen] = React.useState(false)
  const [endOpen, setEndOpen] = React.useState(false)

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
      {/* Start Date */}
      <Field className="w-44">
        <FieldLabel htmlFor="start-date" className="text-xs font-medium text-muted-foreground mb-1">Start Date</FieldLabel>
        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="start-date"
              className="h-9 text-xs justify-between font-normal bg-background shadow-sm w-full"
            >
              <span className="flex items-center truncate">
                <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                {startDate ? startDate.toLocaleDateString() : "Select start date"}
              </span>
              {startDate && (
                <X
                  className="h-3.5 w-3.5 shrink-0 text-muted-foreground hover:text-foreground ml-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    setColumnFilter("start_date", undefined)
                  }}
                />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              defaultMonth={startDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                setColumnFilter("start_date", date ? date.toISOString() : undefined)
                setStartOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>

      {/* End Date */}
      <Field className="w-44">
        <FieldLabel htmlFor="end-date" className="text-xs font-medium text-muted-foreground mb-1">End Date</FieldLabel>
        <Popover open={endOpen} onOpenChange={setEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="end-date"
              className="h-9 text-xs justify-between font-normal bg-background shadow-sm w-full"
            >
              <span className="flex items-center truncate">
                <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                {endDate ? endDate.toLocaleDateString() : "Select end date"}
              </span>
              {endDate && (
                <X
                  className="h-3.5 w-3.5 shrink-0 text-muted-foreground hover:text-foreground ml-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    setColumnFilter("end_date", undefined)
                  }}
                />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              defaultMonth={endDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                setColumnFilter("end_date", date ? date.toISOString() : undefined)
                setEndOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>

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

