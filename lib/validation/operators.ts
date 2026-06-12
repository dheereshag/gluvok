import * as z from "zod"

export const addOperatorSchema = z.object({
  id: z.uuid("System ID must be a valid Supabase Auth UUID"),
  name: z.string().min(3, "Operator full name must be at least 3 characters").max(255, "Operator name must be 255 characters or less"),
})

export const editOperatorSchema = addOperatorSchema
