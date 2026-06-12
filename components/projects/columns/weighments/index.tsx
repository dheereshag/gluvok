import { ColumnDef } from "@tanstack/react-table"
import { Car, Weight, Package, Building, User, Users, Image } from "lucide-react"
import { EntityKey, ProjectSlug } from "@/lib/fields"
import { ColumnLabel } from "@/lib/constants"
import { PillIcon } from "@/components/kibo-ui/pill"
import { useEntitiesStore } from "@/lib/store"
import { commodityPrices } from "@/data/commodity-prices"
import { type CommodityPrice } from "@/types"
import { createTextColumn, createPillColumn, createBaseColumn } from "../helpers"
import { WeighmentImagesCell } from "./cell"

export function getWeighmentsColumns<T>(): ColumnDef<T>[] {
  return [
    createTextColumn(EntityKey.VEHICLE_NUMBER, ColumnLabel.VEHICLE_NUMBER, Car),
    createBaseColumn(
      EntityKey.IMAGES,
      ColumnLabel.IMAGES,
      Image,
      ({ row }) => {
        const images = row.getValue(EntityKey.IMAGES) as string[] | undefined
        const vehicleNumber = row.getValue(EntityKey.VEHICLE_NUMBER) as string
        return <WeighmentImagesCell images={images} vehicleNumber={vehicleNumber} />
      }
    ),
    createPillColumn(
      EntityKey.WEIGHT,
      ColumnLabel.WEIGHT,
      Weight,
      (val) => <><PillIcon icon={Weight} />{val} tons</>,
      { className: "font-mono text-xs font-semibold py-0.5 px-2 bg-muted/60 border border-muted-foreground/10" }
    ),
    createPillColumn(
      EntityKey.COMMODITY_PRICE_ID,
      ColumnLabel.COMMODITY_PRICE_ID,
      Package,
      (val) => {
        const storeState = useEntitiesStore.getState()
        const prices = (storeState.entities[ProjectSlug.COMMODITY_PRICES] || commodityPrices) as CommodityPrice[]
        const priceRec = prices.find((p) => String(p.id) === String(val))
        const displayName = priceRec ? `${priceRec.commodity_name}` : `Price ID: ${val}`
        return <><PillIcon icon={Package} />{displayName}</>
      },
      { className: "font-mono text-[10px] py-0.5 px-2 bg-muted/60 border border-muted-foreground/10" }
    ),
    createPillColumn(
      EntityKey.CENTER_ID,
      ColumnLabel.CENTER_ID,
      Building,
      (val) => <><PillIcon icon={Building} />ID: {val}</>,
      { variant: "outline", className: "font-mono text-[10px] py-0.5 px-2" }
    ),
    createTextColumn(EntityKey.OPERATOR_ID, ColumnLabel.OPERATOR_ID, User, "font-mono text-muted-foreground text-xs"),
    createTextColumn(EntityKey.CUSTOMER_ID, ColumnLabel.CUSTOMER_ID, Users, "font-mono text-muted-foreground text-xs"),
  ]
}
