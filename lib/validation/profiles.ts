import * as z from "zod"
import { useEntitiesStore, getField } from "@/lib/store"
import { ProjectSlug, EntityKey } from "@/lib/fields"
import { ColumnLabel } from "../constants"
import { integerIdSchema, nameSchema, uuidSchema } from "./helpers"

export const addProfileSchema = z.object({
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
}).refine((data) => {
  const userId = data[EntityKey.ID]
  const profiles = useEntitiesStore.getState().entities[ProjectSlug.PROFILES] || []
  const userExists = profiles.some((p) => {
    const uId = getField(p, EntityKey.ID)
    return uId && String(uId) === String(userId)
  })
  return !userExists
}, {
  message: "A profile already exists for this user",
  path: [EntityKey.ID],
})

export const editProfileSchema = addProfileSchema
