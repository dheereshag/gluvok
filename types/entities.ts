import { Role, State, Unit } from "@/lib/constants/enums"

export interface Center {
  id: number
  name: string
  factory_id: number
  created_at: string
  updated_at: string
  // Flattened join fields
  factory_name?: string
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
  unit: Unit
  factory_id: number
  created_at: string
  updated_at: string
  // Flattened join fields
  commodity_name?: string
  factory_name?: string
}

export interface Customer {
  id: number
  govt_id: number
  name: string
  father_name: string
  village_id: number
  user_id?: string
  created_at: string
  updated_at: string
  // Flattened join fields
  village_name?: string
}

export interface Factory {
  id: number
  name: string
  village_id: number
  created_at: string
  updated_at: string
  // Flattened join fields
  village_name?: string
}

export interface Assignment {
  id: number
  factory_id: number
  profile_id: number
  created_at: string
  updated_at: string
  // Flattened join fields
  profile_name?: string
  factory_name?: string
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
  // Flattened join fields
  center_name?: string
  profile_name?: string
  profile_aadhar?: string
  customer_name?: string
  customer_govt_id?: number
  commodity_id?: number
  commodity_name?: string
  unit_price?: string
  unit?: Unit
}

export interface Profile {
  id: number
  user_id: string
  aadhar_number: string
  name: string
  role: Role
  preferences?: Record<string, string[]>
  created_at: string
  updated_at: string
  // Flattened join/view fields
  email?: string
  factory_ids?: number[]
  factory_names?: string
}

/** Union of all entity types used across the app */
export type EntityRecord =
  | Center
  | Commodity
  | Rate
  | Customer
  | Weighment
  | Factory
  | Profile
  | Village
  | Assignment
