import * as z from "zod"
import { EntityKey } from "@/lib/fields"
import { ColumnLabel } from "../constants"
import { integerIdSchema, nameSchema } from "./helpers"

export const addRateSchema = z.object({
  [EntityKey.COMMODITY_NAME]: nameSchema(ColumnLabel.COMMODITY, 1, 255),
  [EntityKey.UNIT_PRICE]: z.coerce.number({ message: `${ColumnLabel.UNIT_PRICE} must be a number` }).positive(`${ColumnLabel.UNIT_PRICE} must be a positive number`),
  [EntityKey.FACTORY_ID]: integerIdSchema(ColumnLabel.FACTORY),
})

export const editRateSchema = addRateSchema
