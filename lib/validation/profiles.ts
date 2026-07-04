/**
 * @file lib/validation/profiles.ts
 * @description Zod schema and validation rules for Profiles entities.
 */

import * as z from "zod"
import { EntityKey, Role, ColumnLabel } from "@/lib/constants/enums"
import { nameSchema, uuidSchema } from "./helpers"

const baseProfileSchema = z.object({
  [EntityKey.AADHAR_NUMBER]: z
    .preprocess(
      (val) => typeof val === "string" ? val.replace(/\s/g, "") : val,
      z.string()
        .length(12, `${ColumnLabel.AADHAR_NUMBER} must be exactly 12 digits`)
        .regex(/^\d+$/, `${ColumnLabel.AADHAR_NUMBER} must contain only digits`)
    ),
  [EntityKey.USER_ID]: uuidSchema(ColumnLabel.USER),
  [EntityKey.NAME]: nameSchema(ColumnLabel.NAME),
  [EntityKey.ROLE]: z.enum(Role, {
    message: "Please select a valid role",
  }),
  [EntityKey.FACTORY_ID]: z.coerce.number().optional().nullable(),
})

export const addProfileSchema = baseProfileSchema

export const editProfileSchema = z.object({
  [EntityKey.AADHAR_NUMBER]: z
    .preprocess(
      (val) => typeof val === "string" ? val.replace(/\s/g, "") : val,
      z.string()
        .length(12, `${ColumnLabel.AADHAR_NUMBER} must be exactly 12 digits`)
        .regex(/^\d+$/, `${ColumnLabel.AADHAR_NUMBER} must contain only digits`)
    ),
  [EntityKey.USER_ID]: uuidSchema(ColumnLabel.USER),
  [EntityKey.NAME]: nameSchema(ColumnLabel.NAME),
  [EntityKey.ROLE]: z.nativeEnum(Role, {
    message: "Please select a valid role",
  }),
  [EntityKey.FACTORY_ID]: z.coerce.number().optional().nullable(),
})
