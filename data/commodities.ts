import { CommodityName } from "@/lib/constants";
import { type Commodity } from "@/types";

export const commodities: Commodity[] = [
  {
    id: 1,
    name: CommodityName.WHEAT,
    unit_price: "24500.00",
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
  {
    id: 2,
    name: CommodityName.SCRAP_COPPER,
    unit_price: "650000.00",
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
  {
    id: 3,
    name: CommodityName.CORN,
    unit_price: "21500.00",
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
  {
    id: 4,
    name: CommodityName.CRUDE_OIL,
    unit_price: "72000.00",
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
]
