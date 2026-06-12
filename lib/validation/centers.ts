import * as z from "zod"

export const addCenterSchema = z.object({
  name: z.string().min(3, "Center name must be at least 3 characters").max(255, "Center name must be 255 characters or less"),
  factory_id: z.coerce.number({ message: "Factory ID must be an integer" }).int("Factory ID must be an integer").positive("Factory ID must be a positive integer"),
})

export const editCenterSchema = addCenterSchema
