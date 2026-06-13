import { Role, State } from "@/lib/constants"

export interface Center {
  id: number
  name: string
  factory_id: number
  created_at: string
  updated_at: string
}

export interface Commodity {
  name: string
  created_at: string
  updated_at: string
}

export interface CommodityPrice {
  id: number
  commodity_name: string
  unit_price: string
  created_at: string
  updated_at: string
}

export interface Customer {
  govt_id: number
  id?: string
  name: string
  father_name: string
  village_id: number
  created_at: string
  updated_at: string
}

export interface Factory {
  id: number
  name: string
  village_id: number
  created_at: string
  updated_at: string
}

export interface Village {
  id: number
  name: string
  state: State
  created_at: string
  updated_at: string
}

export interface Weighment {
  id: number
  vehicle_number: string
  weight: string
  images: string[]
  commodity_price_id: number
  center_id: number
  operator_id: string
  customer_id: number
  created_at: string
  updated_at: string
}

export interface Operator {
  aadhar_number: string
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  role: Role
  created_at: string
  updated_at: string
}
