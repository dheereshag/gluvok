import * as z from "zod"

export const addOperatorSchema = z.object({
  aadhar_number: z
    .string()
    .length(12, "Aadhar number must be exactly 12 digits")
    .regex(/^\d+$/, "Aadhar number must contain only digits"),
  id: z.uuid("System ID must be a valid Supabase Auth UUID"),
  name: z.string().min(3, "Operator full name must be at least 3 characters").max(255, "Operator name must be 255 characters or less"),
})

export const editOperatorSchema = addOperatorSchema
