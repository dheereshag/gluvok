import { State } from "@/lib/constants"

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
