import { Role, State } from "@/lib/constants"

export interface Center {
  id: number
  name: string
  factory_id: number
  created_at: string
  updated_at: string
}

export interface Commodity {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface Rate {
  id: number
  commodity_id: number
  unit_price: string
  factory_id: number
  created_at: string
  updated_at: string
}

export interface Customer {
  id: number
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

export interface Assignment {
  id: number
  factory_id: number
  profile_id: number
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
  rate_id: number
  center_id: number
  profile_id: number
  customer_id: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: number
  user_id: string
  aadhar_number: string
  name: string
  factory_id?: number
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
