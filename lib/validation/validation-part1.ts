import * as z from "zod"
import { State, CommodityName } from "../constants"

// 1. Villages
export const addVillageSchema = z.object({
  name: z.string().min(3, "Village name must be at least 3 characters").max(255, "Village name must be 255 characters or less"),
  state: z.enum(State, { message: "State plate code is required" }),
})
export const editVillageSchema = addVillageSchema

// 2. Factories
export const addFactorySchema = z.object({
  name: z.string().min(1, "Factory name is required").max(255, "Factory name must be 255 characters or less"),
  village_id: z.coerce.number({ message: "Village ID must be an integer" }).int("Village ID must be an integer").positive("Village ID must be a positive integer"),
})
export const editFactorySchema = addFactorySchema

// 3. Centers
export const addCenterSchema = z.object({
  name: z.string().min(3, "Center name must be at least 3 characters").max(255, "Center name must be 255 characters or less"),
  factory_id: z.coerce.number({ message: "Factory ID must be an integer" }).int("Factory ID must be an integer").positive("Factory ID must be a positive integer"),
})
export const editCenterSchema = addCenterSchema

// 4. Commodities
export const addCommoditySchema = z.object({
  name: z.enum(CommodityName, { message: "Commodity type selection is required" }),
  unit_price: z.coerce.number({ message: "Unit price must be a number" }).positive("Unit price must be a positive number"),
})
export const editCommoditySchema = addCommoditySchema

// 5. Customers
export const addCustomerSchema = z.object({
  name: z.string().min(3, "Customer name must be at least 3 characters").max(255, "Customer name must be 255 characters or less"),
  father_name: z.string().min(3, "Father's name must be at least 3 characters").max(255, "Father's name must be 255 characters or less"),
  village_id: z.coerce.number({ message: "Village ID must be an integer" }).int("Village ID must be an integer").positive("Village ID must be a positive integer"),
})
export const editCustomerSchema = addCustomerSchema
