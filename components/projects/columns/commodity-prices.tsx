import { ColumnDef } from "@tanstack/react-table"
import { Coins, Tag } from "lucide-react"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { createTextColumn, createPillColumn } from "./helpers"
import { PillIcon } from "@/components/kibo-ui/pill"

export function getCommodityPricesColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.COMMODITY_NAME, ColumnLabel.COMMODITY_NAME, Tag),
    createPillColumn(
      EntityKey.UNIT_PRICE,
      ColumnLabel.UNIT_PRICE,
      Coins,
      (val) => <><PillIcon icon={Coins} />{val} INR</>,
      { className: "font-mono text-xs font-semibold py-0.5 px-2 bg-muted/60 border border-muted-foreground/10" }
    ),
  ]
}
