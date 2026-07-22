"use client"

/**
 * @file components/projects/filters/weighments.tsx
 * @description Filter controls for the Weighments entity table.
 */

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { EntityKey } from "@/lib/constants/enums"
import { useEntitiesStore } from "@/lib/store"
import { IndianRupee, Building, Users, User } from "lucide-react"
import { BaseCombobox } from "@/components/combobox/base"
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

  const rateOptions = React.useMemo(() => {
    return [
      { value: "all", label: "All Rates" },
      ...rates.map((r) => ({
        value: String(r.id),
        label: r.label,
      })),
    ]
  }, [rates])

  const centerOptions = React.useMemo(() => {
    return [
      { value: "all", label: "All Centers" },
      ...centers.map((c) => ({
        value: String(c.id),
        label: `${c.name} (ID: ${c.id})`,
      })),
    ]
  }, [centers])

  const customerOptions = React.useMemo(() => {
    return [
      { value: "all", label: "All Customers" },
      ...customers.map((c) => ({
        value: String(c.id),
        label: `${c.name} (ID: ${c.id})`,
      })),
    ]
  }, [customers])

  const profileOptions = React.useMemo(() => {
    return [
      { value: "all", label: "All Profiles" },
      ...profiles.map((p) => ({
        value: String(p.id),
        label: `${p.name} (ID: ${p.id})`,
      })),
    ]
  }, [profiles])

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Date Range */}
      <DateRangeFilter table={table} />

      {/* Rate */}
      <BaseCombobox
        type="rate"
        value={currentRateId ? String(currentRateId) : "all"}
        onChange={(val) => setColumnFilter(EntityKey.RATE_ID, val === "all" ? undefined : Number(val))}
        data={rateOptions}
        placeholder="All Rates"
        searchPlaceholder="Search rate..."
        icon={IndianRupee}
        className="w-auto"
        id="filter-rate-combobox"
      />

      {/* Center */}
      <BaseCombobox
        type="center"
        value={currentCenterId ? String(currentCenterId) : "all"}
        onChange={(val) => setColumnFilter(EntityKey.CENTER_ID, val === "all" ? undefined : Number(val))}
        data={centerOptions}
        placeholder="All Centers"
        searchPlaceholder="Search center..."
        icon={Building}
        className="w-auto"
        id="filter-center-combobox"
      />

      {/* Customer */}
      <BaseCombobox
        type="customer"
        value={currentCustomerId ? String(currentCustomerId) : "all"}
        onChange={(val) => setColumnFilter(EntityKey.CUSTOMER_ID, val === "all" ? undefined : Number(val))}
        data={customerOptions}
        placeholder="All Customers"
        searchPlaceholder="Search customer..."
        icon={Users}
        className="w-auto"
        id="filter-customer-combobox"
      />

      {/* Profile */}
      <BaseCombobox
        type="profile"
        value={currentProfileId ? String(currentProfileId) : "all"}
        onChange={(val) => setColumnFilter(EntityKey.PROFILE_ID, val === "all" ? undefined : Number(val))}
        data={profileOptions}
        placeholder="All Profiles"
        searchPlaceholder="Search profile..."
        icon={User}
        className="w-auto"
        id="filter-profile-combobox"
      />
    </div>
  )
}
