import { Role } from "@/lib/constants"
import { Center, Commodity, Customer, Factory, Village } from "./entities"

export * from "./entities"

export interface DataEntry {
  id: number
  vehicle_number: string
  weight: string
  images: string[]
  commodity_id: number
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

/** Union of all entity types used across the app */
export type EntityRecord = Center | Commodity | Customer | DataEntry | Factory | Operator | User | Village
