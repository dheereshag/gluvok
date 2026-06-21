import { ColumnDef } from "@tanstack/react-table"
import { Car, Weight, Package, Building, Power, Image } from "lucide-react"
import { EntityKey, ProjectSlug } from "@/lib/constants/enums"
import { ColumnLabel, ActiveStatus } from "@/lib/constants/enums"
import { useEntitiesStore } from "@/lib/store"
import { rates } from "@/data/rates"
import { type Rate, type Commodity } from "@/types"
import { cn } from "@/lib/utils"
import { createTextColumn, createBaseColumn, createCustomColumn, createProfileAadharColumn, createProfileNameColumn, createCustomerNameColumn, createCustomerGovtIdColumn } from "../helpers"
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
    createCustomColumn(EntityKey.WEIGHT, ColumnLabel.WEIGHT, Weight, (val) => {
      return <div className="font-mono text-xs font-semibold text-foreground">{val} tons</div>
    }),
    createCustomColumn(EntityKey.RATE_ID, ColumnLabel.RATE_ID, Package, (val) => {
      const storeState = useEntitiesStore.getState()
      const activeRates = (storeState.entities[ProjectSlug.RATES] || rates) as Rate[]
      const rateRec = activeRates.find((p) => String(p.id) === String(val))
      const commodityId = rateRec ? rateRec.commodity_id : null
      let commodityName = ""
      switch (commodityId !== null) {
        case true: {
          const activeCommodities = storeState.entities[ProjectSlug.COMMODITIES] as Commodity[] || []
          const comm = activeCommodities.find((c) => Number(c.id) === Number(commodityId))
          commodityName = comm ? comm.name : `Commodity ${commodityId}`
          break
        }
        default:
          break
      }
      const displayName = rateRec ? `${commodityName} (ID: ${val})` : `Rate ID: ${val}`
      return <div className="font-semibold text-xs text-foreground">{displayName}</div>
    }),
    createCustomColumn(EntityKey.CENTER_ID, ColumnLabel.CENTER_ID, Building, (val) => {
      return <div className="font-mono text-xs text-muted-foreground">ID: {val}</div>
    }),
    createProfileAadharColumn(),
    createProfileNameColumn(),
    createCustomerGovtIdColumn(),
    createCustomerNameColumn(),
    createCustomColumn(EntityKey.IS_ACTIVE, ColumnLabel.IS_ACTIVE, Power, (val) => {
      const isActive = val === "true"
      return (
        <span className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm",
          isActive
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/30"
            : "bg-muted text-muted-foreground border border-border"
        )}>
          {isActive ? ActiveStatus.ACTIVE : ActiveStatus.INACTIVE}
        </span>
      )
    }),
  ]
}


