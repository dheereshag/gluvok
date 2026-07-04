/**
 * @file components/projects/columns/villages.tsx
 * @description Column definitions and rendering helpers for the Villages entity table.
 */

import { ColumnDef } from "@tanstack/react-table"
import { Globe, Tag } from "lucide-react"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { createTextColumn } from "./helpers"

export function getVillagesColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Tag),
    createTextColumn(EntityKey.STATE, ColumnLabel.STATE, Globe),
  ]
}
