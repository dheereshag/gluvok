import * as z from "zod"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { integerIdSchema, nameSchema } from "./helpers"

const baseCustomerSchema = z.object({
  [EntityKey.GOVT_ID]: integerIdSchema(ColumnLabel.GOVT_ID),
  [EntityKey.USER_ID]: z.string().uuid(`${ColumnLabel.USER} must be a valid User selection`).optional().or(z.literal("")).transform((v) => v === "" ? undefined : v),
  [EntityKey.NAME]: nameSchema(ColumnLabel.NAME),
  [EntityKey.FATHER_NAME]: nameSchema(ColumnLabel.FATHER_NAME),
  [EntityKey.VILLAGE_ID]: integerIdSchema(ColumnLabel.VILLAGE),
})

export const addCustomerSchema = baseCustomerSchema

export const editCustomerSchema = z.object({
  [EntityKey.ID]: z.coerce.number().optional(),
  [EntityKey.GOVT_ID]: integerIdSchema(ColumnLabel.GOVT_ID),
  [EntityKey.USER_ID]: z.string().uuid(`${ColumnLabel.USER} must be a valid User selection`).optional().or(z.literal("")).transform((v) => v === "" ? undefined : v),
  [EntityKey.NAME]: nameSchema(ColumnLabel.NAME),
  [EntityKey.FATHER_NAME]: nameSchema(ColumnLabel.FATHER_NAME),
  [EntityKey.VILLAGE_ID]: integerIdSchema(ColumnLabel.VILLAGE),
})
