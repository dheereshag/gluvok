import { ColumnDef } from "@tanstack/react-table"
import { Car, Weight, Package, Building, User, Users, Image, CheckCircle } from "lucide-react"
import { EntityKey, ProjectSlug } from "@/lib/fields"
import { ColumnLabel, ActiveStatus } from "@/lib/constants"
import { PillIcon } from "@/components/kibo-ui/pill"
import { useEntitiesStore } from "@/lib/store"
import { rates } from "@/data/rates"
import { type Rate } from "@/types"
import { cn } from "@/lib/utils"
import { createTextColumn, createPillColumn, createBaseColumn, createCustomColumn, getCommodityIcon } from "../helpers"
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
      { className: "h-6 py-0.5 px-2.5 text-[11px] font-mono font-semibold bg-muted/50 border border-muted-foreground/15 hover:bg-muted/70 text-foreground transition-all duration-200" }
    ),
    createPillColumn(
      EntityKey.RATE_ID,
      ColumnLabel.RATE_ID,
      Package,
      (val) => {
        const storeState = useEntitiesStore.getState()
        const activeRates = (storeState.entities[ProjectSlug.RATES] || rates) as Rate[]
        const rateRec = activeRates.find((p) => String(p.id) === String(val))
        const displayName = rateRec ? `${rateRec.commodity_name} (ID: ${val})` : `Rate ID: ${val}`
        const Icon = getCommodityIcon(rateRec ? rateRec.commodity_name : "")
        return <><PillIcon icon={Icon} />{displayName}</>
      },
      { className: "h-6 py-0.5 px-2.5 text-[10px] font-mono font-semibold bg-muted/50 border border-muted-foreground/15 hover:bg-muted/70 text-foreground transition-all duration-200" }
    ),
    createPillColumn(
      EntityKey.CENTER_ID,
      ColumnLabel.CENTER_ID,
      Building,
      (val) => <><PillIcon icon={Building} />ID: {val}</>,
      { className: "h-6 py-0.5 px-2.5 text-[10px] font-mono font-semibold bg-transparent border border-border hover:bg-muted/20 text-muted-foreground transition-all duration-200" }
    ),
    createTextColumn(EntityKey.PROFILE_ID, ColumnLabel.PROFILE_ID, User, "font-mono text-muted-foreground text-xs"),
    createTextColumn(EntityKey.CUSTOMER_ID, ColumnLabel.CUSTOMER_ID, Users, "font-mono text-muted-foreground text-xs"),
    createCustomColumn(EntityKey.IS_ACTIVE, ColumnLabel.IS_ACTIVE, CheckCircle, (val) => {
      const isActive = val === ActiveStatus.ACTIVE || val === "true"
      return (
        <span className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm",
          isActive
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/30"
            : "bg-muted text-muted-foreground border border-border"
        )}>
          {isActive ? "Active" : "Inactive"}
        </span>
      )
    }),
  ]
}
