import * as z from "zod"
import { State, Role } from "../constants"

// 6. Operators
export const addOperatorSchema = z.object({
  id: z.uuid("System ID must be a valid Supabase Auth UUID"),
  name: z.string().min(3, "Operator full name must be at least 3 characters").max(255, "Operator name must be 255 characters or less"),
})
export const editOperatorSchema = addOperatorSchema

// 7. Users
export const addUserSchema = z.object({
  email: z.string().email("Please provide a valid email format"),
  role: z.enum(Role, { message: "Role selection is required" }),
})
export const editUserSchema = addUserSchema

// 8. Data Entries
export const addDataEntrySchema = z.object({
  vehicle_number: z
    .string()
    .min(1, "Vehicle plate number is required")
    .max(10, "Vehicle plate must be 10 characters or less")
    .regex(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/, "Must match standard Indian license plate format (e.g. PB10XY1234)")
    .refine((val) => Object.keys(State).includes(val.substring(0, 2)), {
      message: "First two characters must be a valid Indian state or union territory code"
    }),
  weight: z.coerce.number({ message: "Weight must be a number" }).positive("Measured weight must be a positive number"),
  commodity_id: z.coerce.number({ message: "Commodity ID must be an integer" }).int("Commodity ID must be an integer").positive("Commodity ID must be a positive integer"),
  center_id: z.coerce.number({ message: "Center ID must be an integer" }).int("Center ID must be an integer").positive("Center ID must be a positive integer"),
  operator_id: z.string().length(12, "Operator Aadhar number must be exactly 12 characters"),
  customer_id: z.coerce.number({ message: "Customer ID must be an integer" }).int("Customer ID must be an integer").positive("Customer ID must be a positive integer"),
})
export const editDataEntrySchema = addDataEntrySchema
