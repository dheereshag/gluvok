import { ColumnDef } from "@tanstack/react-table"
import { IndianRupee, Tag } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createCustomColumn, getCommodityIcon } from "./helpers"

export function getCommodityPricesColumns<T>(): ColumnDef<T>[] {
  return [
    createCustomColumn(EntityKey.COMMODITY_NAME, ColumnLabel.COMMODITY_NAME, Tag, (val) => {
      const Icon = getCommodityIcon(val)
      return (
        <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs">
          <Icon className="h-3.5 w-3.5 text-muted-foreground/75" />
          {val}
        </div>
      )
    }),
    createCustomColumn(EntityKey.UNIT_PRICE, ColumnLabel.UNIT_PRICE, IndianRupee, (val) => {
      const price = parseFloat(val)
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(price)
      return <div className="font-medium text-xs text-emerald-600 dark:text-emerald-500 font-mono">{formatted}</div>
    }),
  ]
}
