/**
 * @file lib/validation/weighments.ts
 * @description Zod schema and validation rules for Weighments entities.
 */

import * as z from "zod"
import { ColumnLabel, Unit, WeighmentType } from "@/lib/constants/enums"
import { EntityKey } from "@/lib/constants/enums"
import { integerIdSchema } from "./helpers"

const STATE_CODES = [
  'AN','AP','AR','AS','BR','CH','CG','DD','DL','DN','GA','GJ','HR','HP',
  'JK','JH','KA','KL','LA','LD','MP','MH','MN','ML','MZ','NL','OD','PY',
  'PB','RJ','SK','TN','TS','TR','UP','UK','WB'
]

export const addWeighmentSchema = z.object({
  [EntityKey.VEHICLE_NUMBER]: z
    .string()
    .min(1, `${ColumnLabel.VEHICLE_NUMBER} plate number is required`)
    .max(10, `${ColumnLabel.VEHICLE_NUMBER} plate must be 10 characters or less`)
    .regex(
      /^([A-Z]{2}\d{2}[A-Z]{1,2}\d{4})|(\d{2}BH\d{4}[A-Z]{1,2})$/,
      `Must match standard Indian plate (e.g. PB10XY1234) or BH series plate (e.g. 21BH1234AB)`
    )
    .refine(
      (val) => {
        if (/^\d{2}BH/.test(val)) return true
        return STATE_CODES.includes(val.substring(0, 2))
      },
      {
        message: `First two characters must be a valid Indian state or union territory code`
      }
    ),
  [EntityKey.WEIGHT]: z.coerce.number({ message: `${ColumnLabel.WEIGHT} must be a number` }).positive(`Measured ${ColumnLabel.WEIGHT.toLowerCase()} must be a positive number`),
  [EntityKey.UNIT]: z.enum(Unit, { message: `${ColumnLabel.UNIT} must be a valid unit (kg, q, or gal)` }),
  [EntityKey.TYPE]: z.enum(WeighmentType, { message: `${ColumnLabel.TYPE} must be a valid type (in or out)` }),
  [EntityKey.RATE_ID]: integerIdSchema(ColumnLabel.RATE),
  [EntityKey.CENTER_ID]: integerIdSchema(ColumnLabel.CENTER),
  [EntityKey.PROFILE_ID]: integerIdSchema(ColumnLabel.PROFILE),
  [EntityKey.CUSTOMER_ID]: integerIdSchema(ColumnLabel.CUSTOMER),
  [EntityKey.IS_ACTIVE]: z.boolean().default(true),
  [EntityKey.IMAGES]: z.array(z.string()).optional(),
})

export const editWeighmentSchema = addWeighmentSchema

