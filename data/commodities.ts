export interface Commodity {
  id: string
  name: string
  unit_price: string
  created_at: string
  updated_at: string
}

export const commodities: Commodity[] = [
  {
    id: "1",
    name: "Wheat",
    unit_price: "24500.00",
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
  {
    id: "2",
    name: "Scrap Copper",
    unit_price: "650000.00",
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
  {
    id: "3",
    name: "Corn",
    unit_price: "21500.00",
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
  {
    id: "4",
    name: "Crude Oil",
    unit_price: "72000.00",
    created_at: "2026-06-07 11:50:14.658144",
    updated_at: "2026-06-07 11:50:14.658144",
  },
]
