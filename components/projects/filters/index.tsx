"use client"

/**
 * @file components/projects/filters/index.tsx
 * @description Dynamic filter router for each project entity slug.
 */

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { ProjectSlug } from "@/lib/constants/enums"
import { RatesFilters } from "./rates"

interface ProjectFiltersProps<TData> {
  projectSlug: string
  table: Table<TData>
}

export function ProjectFilters<TData>({ projectSlug, table }: ProjectFiltersProps<TData>) {
  switch (projectSlug) {
    case ProjectSlug.RATES:
      return <RatesFilters table={table} />
    default:
      return null
  }
}
