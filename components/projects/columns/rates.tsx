import { ColumnDef } from "@tanstack/react-table"
import { IndianRupee, Weight } from "lucide-react"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { createCustomColumn, createFactoryNameColumn, createCommodityNameColumn, createFactoryIdColumn, createTextColumn } from "./helpers"

export function getRatesColumns<T>(): ColumnDef<T>[] {
  return [
    createCommodityNameColumn(),
    createFactoryIdColumn(),
    createFactoryNameColumn(),
    createCustomColumn(EntityKey.UNIT_PRICE, ColumnLabel.UNIT_PRICE, IndianRupee, (val) => {
      const price = parseFloat(val)
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(price)
      return <div className="font-medium text-xs text-emerald-600 dark:text-emerald-500 font-mono">{formatted}</div>
    }),
    createTextColumn(EntityKey.UNIT, ColumnLabel.UNIT, Weight),
  ]
}

