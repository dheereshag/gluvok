import { type Rate } from "@/types"
import { Unit } from "@/lib/constants/enums"

export const rates: Rate[] = [
  {
    id: 1,
    commodity_id: 1, // Wheat
    unit_price: "24500.00",
    unit: Unit.Q,
    factory_id: 1,
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
  {
    id: 2,
    commodity_id: 2, // Scrap Copper
    unit_price: "650000.00",
    unit: Unit.KG,
    factory_id: 2,
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
  {
    id: 3,
    commodity_id: 3, // Corn
    unit_price: "21500.00",
    unit: Unit.Q,
    factory_id: 2,
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
  {
    id: 4,
    commodity_id: 4, // Crude Oil
    unit_price: "72000.00",
    unit: Unit.GAL,
    factory_id: 2,
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
]
