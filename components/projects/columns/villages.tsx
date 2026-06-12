import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Home, Globe } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { PillIcon } from "@/components/kibo-ui/pill"
import { createTextColumn, createPillColumn } from "./helpers"

export function getVillagesColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.NAME, ColumnLabel.NAME, Home),
    createPillColumn(
      EntityKey.STATE,
      ColumnLabel.STATE,
      Globe,
      (val) => <><PillIcon icon={Globe} />{val}</>,
      { variant: "outline", className: "font-bold text-xs text-muted-foreground py-0.5 px-2" }
    ),
  ]
}
