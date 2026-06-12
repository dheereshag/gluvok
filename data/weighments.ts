import { type Weighment } from "@/types"

export const weighments: Weighment[] = [
  { id: 1, vehicle_number: "PB10AB1234", weight: "12.500", images: ["uploads/wheat1.jpg", "uploads/wheat2.jpg"], commodity_price_id: 1, center_id: 1, operator_id: "123456789012", customer_id: 1001, created_at: "2026-06-07 11:50:14.658144", updated_at: "2026-06-07 11:50:14.658144" },
  { id: 2, vehicle_number: "PB02XY9876", weight: "18.750", images: [
    "uploads/copper1.jpg", 
    "uploads/copper2.jpg",
    "uploads/wheat1.jpg",
    "uploads/wheat2.jpg",
    "uploads/corn1.jpg",
    "uploads/oil1.jpg",
    "uploads/copper1.jpg", 
    "uploads/copper2.jpg",
    "uploads/wheat1.jpg",
    "uploads/wheat2.jpg"
  ], commodity_price_id: 2, center_id: 2, operator_id: "123456789012", customer_id: 1002, created_at: "2026-06-07 11:50:14.658144", updated_at: "2026-06-07 11:50:14.658144" },
  { id: 3, vehicle_number: "RJ14CD4567", weight: "25.200", images: ["uploads/corn1.jpg", "uploads/wheat2.jpg"], commodity_price_id: 3, center_id: 4, operator_id: "234567890123", customer_id: 1003, created_at: "2026-06-07 11:50:14.658144", updated_at: "2026-06-07 11:50:14.658144" },
  { id: 4, vehicle_number: "HR20EF1111", weight: "30.450", images: ["uploads/oil1.jpg"], commodity_price_id: 4, center_id: 5, operator_id: "345678901234", customer_id: 1004, created_at: "2026-06-07 11:50:14.658144", updated_at: "2026-06-07 11:50:14.658144" },
  { id: 5, vehicle_number: "PB91GH2222", weight: "10.000", images: [], commodity_price_id: 1, center_id: 3, operator_id: "234567890123", customer_id: 1005, created_at: "2026-06-07 11:50:14.658144", updated_at: "2026-06-07 11:50:14.658144" },
]
