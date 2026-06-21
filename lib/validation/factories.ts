import * as z from "zod"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { integerIdSchema, nameSchema } from "./helpers"

export const addFactorySchema = z.object({
  [EntityKey.NAME]: nameSchema(ColumnLabel.NAME, 1, 255),
  [EntityKey.VILLAGE_ID]: integerIdSchema(ColumnLabel.VILLAGE),
})

export const editFactorySchema = addFactorySchema
