/**
 * @file components/projects/columns/centers.tsx
 * @description Column definitions and rendering helpers for the Centers entity table.
 */

import { ColumnDef } from "@tanstack/react-table"
import { Tag, Factory } from "lucide-react"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { createTextColumn, createIdColumn } from "./helpers"

export function getCentersColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Tag),
    createIdColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Factory),
    createTextColumn(EntityKey.FACTORY_NAME, ColumnLabel.FACTORY_NAME, Factory),
  ]
}
