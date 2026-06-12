import * as z from "zod"

export const addCustomerSchema = z.object({
  name: z.string().min(3, "Customer name must be at least 3 characters").max(255, "Customer name must be 255 characters or less"),
  father_name: z.string().min(3, "Father's name must be at least 3 characters").max(255, "Father's name must be 255 characters or less"),
  village_id: z.coerce.number({ message: "Village ID must be an integer" }).int("Village ID must be an integer").positive("Village ID must be a positive integer"),
})

export const editCustomerSchema = addCustomerSchema
