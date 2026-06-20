import * as z from "zod"
import { useEntitiesStore, getField } from "@/lib/store"
import { ProjectSlug, EntityKey } from "@/lib/fields"
import { ColumnLabel } from "../constants"
import { integerIdSchema, nameSchema, uuidSchema } from "./helpers"

const baseProfileSchema = z.object({
  [EntityKey.AADHAR_NUMBER]: z
    .preprocess(
      (val) => typeof val === "string" ? val.replace(/\s/g, "") : val,
      z.string()
        .length(12, `${ColumnLabel.AADHAR_NUMBER} must be exactly 12 digits`)
        .regex(/^\d+$/, `${ColumnLabel.AADHAR_NUMBER} must contain only digits`)
    ),
  [EntityKey.ID]: uuidSchema(ColumnLabel.USER),
  [EntityKey.NAME]: nameSchema(ColumnLabel.NAME),
  [EntityKey.FACTORY_ID]: integerIdSchema(ColumnLabel.FACTORY),
})

export const addProfileSchema = baseProfileSchema
  .refine((data) => {
    const aadharVal = data[EntityKey.AADHAR_NUMBER]
    const profiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] || []
    return !profiles.some((p) => String(getField(p, EntityKey.AADHAR_NUMBER)) === String(aadharVal))
  }, {
    message: "A profile with this Aadhar number already exists",
    path: [EntityKey.AADHAR_NUMBER],
  })
  .refine((data) => {
    const userId = data[EntityKey.ID]
    const profiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] || []
    return !profiles.some((p) => String(getField(p, EntityKey.ID)) === String(userId))
  }, {
    message: "A profile already exists for this user",
    path: [EntityKey.ID],
  })

export const editProfileSchema = baseProfileSchema
