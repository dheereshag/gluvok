import * as z from "zod"

export const addCommodityPriceSchema = z.object({
  commodity_name: z.string().min(1, "Commodity name selection is required"),
  unit_price: z.coerce.number({ message: "Unit price must be a number" }).positive("Unit price must be a positive number"),
})

export const editCommodityPriceSchema = addCommodityPriceSchema
