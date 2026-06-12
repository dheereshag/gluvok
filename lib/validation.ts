import * as z from "zod"
import { State, CommodityName, Role } from "./constants"
import { ProjectSlug } from "./fields"

// 1. Villages
export const addVillageSchema = z.object({
  name: z
    .string()
    .min(3, "Village name must be at least 3 characters")
    .max(255, "Village name must be 255 characters or less"),
  state: z.nativeEnum(State, { message: "State plate code is required" }),
})
export const editVillageSchema = addVillageSchema

// 2. Factories
export const addFactorySchema = z.object({
  name: z
    .string()
    .min(1, "Factory name is required")
    .max(255, "Factory name must be 255 characters or less"),
  village_id: z.coerce
    .number({ message: "Village ID must be an integer" })
    .int("Village ID must be an integer")
    .positive("Village ID must be a positive integer"),
})
export const editFactorySchema = addFactorySchema

// 3. Centers
export const addCenterSchema = z.object({
  name: z
    .string()
    .min(3, "Center name must be at least 3 characters")
    .max(255, "Center name must be 255 characters or less"),
  factory_id: z.coerce
    .number({ message: "Factory ID must be an integer" })
    .int("Factory ID must be an integer")
    .positive("Factory ID must be a positive integer"),
})
export const editCenterSchema = addCenterSchema

// 4. Commodities
export const addCommoditySchema = z.object({
  name: z.enum(CommodityName, { message: "Commodity type selection is required" }),
  unit_price: z.coerce
    .number({ message: "Unit price must be a number" })
    .positive("Unit price must be a positive number"),
})
export const editCommoditySchema = addCommoditySchema

// 5. Customers
export const addCustomerSchema = z.object({
  name: z
    .string()
    .min(3, "Customer name must be at least 3 characters")
    .max(255, "Customer name must be 255 characters or less"),
  father_name: z
    .string()
    .min(3, "Father's name must be at least 3 characters")
    .max(255, "Father's name must be 255 characters or less"),
  village_id: z.coerce
    .number({ message: "Village ID must be an integer" })
    .int("Village ID must be an integer")
    .positive("Village ID must be a positive integer"),
})
export const editCustomerSchema = addCustomerSchema

// 6. Operators
export const addOperatorSchema = z.object({
  id: z.uuid("System ID must be a valid Supabase Auth UUID"),
  name: z
    .string()
    .min(3, "Operator full name must be at least 3 characters")
    .max(255, "Operator name must be 255 characters or less"),
})
export const editOperatorSchema = addOperatorSchema

// 7. Users
export const addUserSchema = z.object({
  email: z.email("Please provide a valid email format"),
  role: z.enum(Role, { message: "Role selection is required" }),
})
export const editUserSchema = addUserSchema

// 8. Data Entries
export const addDataEntrySchema = z.object({
  vehicle_number: z
    .string()
    .min(1, "Vehicle plate number is required")
    .max(10, "Vehicle plate must be 10 characters or less")
    .regex(
      /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/,
      "Must match standard Indian license plate format (e.g. PB10XY1234)"
    ),
  weight: z.coerce
    .number({ message: "Weight must be a number" })
    .positive("Measured weight must be a positive number"),
  commodity_id: z.coerce
    .number({ message: "Commodity ID must be an integer" })
    .int("Commodity ID must be an integer")
    .positive("Commodity ID must be a positive integer"),
  center_id: z.coerce
    .number({ message: "Center ID must be an integer" })
    .int("Center ID must be an integer")
    .positive("Center ID must be a positive integer"),
  operator_id: z
    .string()
    .length(12, "Operator Aadhar number must be exactly 12 characters"),
  customer_id: z.coerce
    .number({ message: "Customer ID must be an integer" })
    .int("Customer ID must be an integer")
    .positive("Customer ID must be a positive integer"),
})
export const editDataEntrySchema = addDataEntrySchema

// Centralized schema registries preserving original Zod types via const assertion
export const ENTITY_ADD_SCHEMAS = {
  [ProjectSlug.CENTERS]: addCenterSchema,
  [ProjectSlug.COMMODITIES]: addCommoditySchema,
  [ProjectSlug.CUSTOMERS]: addCustomerSchema,
  [ProjectSlug.DATA_ENTRIES]: addDataEntrySchema,
  [ProjectSlug.FACTORIES]: addFactorySchema,
  [ProjectSlug.OPERATORS]: addOperatorSchema,
  [ProjectSlug.USERS]: addUserSchema,
  [ProjectSlug.VILLAGES]: addVillageSchema,
} as const

export const ENTITY_EDIT_SCHEMAS = {
  [ProjectSlug.CENTERS]: editCenterSchema,
  [ProjectSlug.COMMODITIES]: editCommoditySchema,
  [ProjectSlug.CUSTOMERS]: editCustomerSchema,
  [ProjectSlug.DATA_ENTRIES]: editDataEntrySchema,
  [ProjectSlug.FACTORIES]: editFactorySchema,
  [ProjectSlug.OPERATORS]: editOperatorSchema,
  [ProjectSlug.USERS]: editUserSchema,
  [ProjectSlug.VILLAGES]: editVillageSchema,
} as const
