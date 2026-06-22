import * as z from "zod"
import { useEntitiesStore, getField } from "@/lib/store"
import { ProjectSlug, EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { integerIdSchema, nameSchema, uuidSchema } from "./helpers"

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
})

export const addProfileSchema = baseProfileSchema
  .refine((data) => {
    const aadharVal = data[EntityKey.AADHAR_NUMBER]
    const profiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] || []
    return !profiles.some((p) => String(getField(p, EntityKey.AADHAR_NUMBER)).replace(/\s/g, "") === String(aadharVal).replace(/\s/g, ""))
  }, {
    message: "A profile with this Aadhar number already exists",
    path: [EntityKey.AADHAR_NUMBER],
  })
  .refine((data) => {
    const userId = data[EntityKey.USER_ID]
    const profiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] || []
    return !profiles.some((p) => String(getField(p, EntityKey.USER_ID)) === String(userId))
  }, {
    message: "A profile already exists for this user",
    path: [EntityKey.USER_ID],
  })

export const editProfileSchema = z.object({
  [EntityKey.ID]: z.coerce.number().optional(),
  [EntityKey.AADHAR_NUMBER]: z
    .preprocess(
      (val) => typeof val === "string" ? val.replace(/\s/g, "") : val,
      z.string()
        .length(12, `${ColumnLabel.AADHAR_NUMBER} must be exactly 12 digits`)
        .regex(/^\d+$/, `${ColumnLabel.AADHAR_NUMBER} must contain only digits`)
    ),
  [EntityKey.USER_ID]: uuidSchema(ColumnLabel.USER),
  [EntityKey.NAME]: nameSchema(ColumnLabel.NAME),
}).refine((data) => {
  const aadharVal = data[EntityKey.AADHAR_NUMBER]
  const profiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] || []
  return !profiles.some((p) => 
    Number(getField(p, EntityKey.ID)) !== Number(data[EntityKey.ID]) &&
    String(getField(p, EntityKey.AADHAR_NUMBER)).replace(/\s/g, "") === String(aadharVal).replace(/\s/g, "")
  )
}, {
  message: "A profile with this Aadhar number already exists",
  path: [EntityKey.AADHAR_NUMBER],
}).refine((data) => {
  const userId = data[EntityKey.USER_ID]
  const profiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] || []
  return !profiles.some((p) => 
    Number(getField(p, EntityKey.ID)) !== Number(data[EntityKey.ID]) &&
    String(getField(p, EntityKey.USER_ID)) === String(userId)
  )
}, {
  message: "A profile already exists for this user",
  path: [EntityKey.USER_ID],
})
