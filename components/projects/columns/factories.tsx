/**
 * @file components/projects/columns/factories.tsx
 * @description Column definitions and rendering helpers for the Factories entity table.
 */

import { ColumnDef } from "@tanstack/react-table"
import { Tag } from "lucide-react"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { createTextColumn } from "./helpers"

export function getFactoriesColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Tag),
  ]
}
