import * as z from "zod"

export const addCommoditySchema = z.object({
  name: z.string().min(1, "Commodity name is required").max(100, "Commodity name must be 100 characters or less"),
})

export const editCommoditySchema = addCommoditySchema
