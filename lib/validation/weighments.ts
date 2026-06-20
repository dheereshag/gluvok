import * as z from "zod"
import { State } from "../constants"

export const addWeighmentSchema = z.object({
  vehicle_number: z
    .string()
    .min(1, "Vehicle plate number is required")
    .max(10, "Vehicle plate must be 10 characters or less")
    .regex(
      /^([A-Z]{2}\d{2}[A-Z]{1,2}\d{4})|(\d{2}BH\d{4}[A-Z]{1,2})$/,
      "Must match standard Indian plate (e.g. PB10XY1234) or BH series plate (e.g. 21BH1234AB)"
    )
    .refine(
      (val) => {
        if (/^\d{2}BH/.test(val)) return true
        return Object.keys(State).includes(val.substring(0, 2))
      },
      {
        message: "First two characters must be a valid Indian state or union territory code"
      }
    ),
  weight: z.coerce.number({ message: "Weight must be a number" }).positive("Measured weight must be a positive number"),
  rate_id: z.coerce.number({ message: "Rate ID must be an integer" }).int("Rate ID must be an integer").positive("Rate ID must be a positive integer"),
  center_id: z.coerce.number({ message: "Center ID must be an integer" }).int("Center ID must be an integer").positive("Center ID must be a positive integer"),
  profile_id: z
    .preprocess(
      (val) => typeof val === "string" ? val.replace(/\s/g, "") : val,
      z.string().length(12, "Profile Aadhar number must be exactly 12 characters")
    ),
  customer_id: z.coerce.number({ message: "Customer ID must be an integer" }).int("Customer ID must be an integer").positive("Customer ID must be a positive integer"),
  is_active: z.boolean().default(true),
  images: z.array(z.string()).optional(),
})

export const editWeighmentSchema = addWeighmentSchema
