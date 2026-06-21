import * as z from "zod"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { integerIdSchema } from "./helpers"

export const addRateSchema = z.object({
  [EntityKey.COMMODITY_ID]: integerIdSchema(ColumnLabel.COMMODITY),
  [EntityKey.UNIT_PRICE]: z.coerce.number({ message: `${ColumnLabel.UNIT_PRICE} must be a number` }).positive(`${ColumnLabel.UNIT_PRICE} must be a positive number`),
  [EntityKey.FACTORY_ID]: integerIdSchema(ColumnLabel.FACTORY),
})

export const editRateSchema = addRateSchema
