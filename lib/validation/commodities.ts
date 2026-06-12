import * as z from "zod"
import { CommodityName } from "../constants"

export const addCommoditySchema = z.object({
  name: z.enum(CommodityName, { message: "Commodity type selection is required" }),
  unit_price: z.coerce.number({ message: "Unit price must be a number" }).positive("Unit price must be a positive number"),
})

export const editCommoditySchema = addCommoditySchema
