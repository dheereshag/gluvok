import * as z from "zod"

export const addRateSchema = z.object({
  commodity_name: z.string().min(1, "Commodity name selection is required"),
  unit_price: z.coerce.number({ message: "Unit price must be a number" }).positive("Unit price must be a positive number"),
  factory_id: z.coerce.number({ message: "Factory ID must be an integer" }).int("Factory ID must be an integer").positive("Factory ID must be a positive integer"),
})

export const editRateSchema = addRateSchema
