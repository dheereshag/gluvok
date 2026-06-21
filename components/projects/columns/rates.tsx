import { ColumnDef } from "@tanstack/react-table"
import { Factory, IndianRupee } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createCustomColumn, createTextColumn, createFactoryNameColumn, createCommodityNameColumn } from "./helpers"

export function getRatesColumns<T>(): ColumnDef<T>[] {
  return [
    createCommodityNameColumn(),
    createTextColumn(EntityKey.FACTORY_ID, ColumnLabel.FACTORY_ID, Factory, "font-mono text-muted-foreground text-xs"),
    createFactoryNameColumn(),
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

