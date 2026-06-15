import * as z from "zod"

export const addFactorySchema = z.object({
  name: z.string().min(1, "Factory name is required").max(255, "Factory name must be 255 characters or less"),
  village_id: z.coerce.number({ message: "Village ID must be an integer" }).int("Village ID must be an integer").positive("Village ID must be a positive integer"),
  user_id: z.string().uuid("User ID must be a valid UUID"),
})

export const editFactorySchema = addFactorySchema
