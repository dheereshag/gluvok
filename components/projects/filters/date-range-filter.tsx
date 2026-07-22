"use client"

/**
 * @file components/projects/filters/date-range-filter.tsx
 * @description Reusable Date Range filter component with month & year dropdowns for entity tables.
 */

import * as React from "react"
import { format } from "date-fns"
import { type DateRange } from "react-day-picker"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon, X } from "lucide-react"

interface DateRangeFilterProps<TData> {
  table: Table<TData>
  startKey?: string
  endKey?: string
  className?: string
}

export function DateRangeFilter<TData>({
  table,
  startKey = "start_date",
  endKey = "end_date",
  className = "w-auto",
}: DateRangeFilterProps<TData>) {
  const columnFilters = table.getState().columnFilters
  const currentStartDateVal = columnFilters.find((f) => f.id === startKey)?.value as string | undefined
  const currentEndDateVal = columnFilters.find((f) => f.id === endKey)?.value as string | undefined

  const dateRange: DateRange | undefined = React.useMemo(() => {
    const from = currentStartDateVal ? new Date(currentStartDateVal) : undefined
    const to = currentEndDateVal ? new Date(currentEndDateVal) : undefined
    if (!from && !to) return undefined
    return { from, to }
  }, [currentStartDateVal, currentEndDateVal])

  const [open, setOpen] = React.useState(false)

  const handleRangeSelect = (range: DateRange | undefined) => {
    table.setColumnFilters((prev) => {
      const filtered = prev.filter((f) => f.id !== startKey && f.id !== endKey)
      if (range?.from) {
        filtered.push({ id: startKey, value: range.from.toISOString() })
      }
      if (range?.to) {
        filtered.push({ id: endKey, value: range.to.toISOString() })
      }
      return filtered
    })
  }

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    handleRangeSelect(undefined)
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative inline-flex items-center w-full">
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker-range"
              aria-label="Filter by Date Range"
              className={`h-9 text-xs justify-between font-normal bg-background shadow-sm px-2.5 w-full ${dateRange?.from ? "pr-8" : ""}`}
            >
              <span className="flex items-center truncate">
                <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </span>
            </Button>
          </PopoverTrigger>
          {dateRange?.from && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-5 w-5 absolute right-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors"
              title="Clear date filter"
              aria-label="Clear date filter"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <PopoverContent className="w-auto p-0 flex flex-col" align="start">
          <Calendar
            mode="range"
            captionLayout="dropdown"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleRangeSelect}
            numberOfMonths={2}
          />
          {dateRange?.from && (
            <div className="flex items-center justify-between border-t border-border px-3 py-2 bg-muted/30">
              <span className="text-xs text-muted-foreground">
                {dateRange.to ? "Range selected" : "Select end date"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleClear()
                  setOpen(false)
                }}
                className="h-7 text-xs px-2 gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-3.5 w-3.5" />
                Clear dates
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
