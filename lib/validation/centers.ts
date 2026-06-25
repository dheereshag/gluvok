import * as z from "zod"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { integerIdSchema, nameSchema } from "./helpers"

const baseCenterSchema = z.object({
  [EntityKey.NAME]: nameSchema(ColumnLabel.NAME),
  [EntityKey.FACTORY_ID]: integerIdSchema(ColumnLabel.FACTORY),
})

export const addCenterSchema = baseCenterSchema

export const editCenterSchema = baseCenterSchema
