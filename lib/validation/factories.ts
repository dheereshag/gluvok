/**
 * @file lib/validation/factories.ts
 * @description Zod schema and validation rules for Factories entities.
 */

import * as z from "zod"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { nameSchema } from "./helpers"

export const addFactorySchema = z.object({
  [EntityKey.NAME]: nameSchema(ColumnLabel.NAME, 1, 255),
})

export const editFactorySchema = addFactorySchema
