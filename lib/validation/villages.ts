/**
 * @file lib/validation/villages.ts
 * @description Zod schema and validation rules for Villages entities.
 */

import * as z from "zod"
import { State, ColumnLabel } from "@/lib/constants/enums"
import { EntityKey } from "@/lib/constants/enums"
import { nameSchema } from "./helpers"

export const addVillageSchema = z.object({
  [EntityKey.NAME]: nameSchema(ColumnLabel.VILLAGE),
  [EntityKey.STATE]: z.nativeEnum(State, { message: `${ColumnLabel.STATE} plate code is required` }),
})

export const editVillageSchema = addVillageSchema
