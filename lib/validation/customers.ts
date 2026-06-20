import * as z from "zod"
import { useEntitiesStore, getField } from "@/lib/store"
import { ProjectSlug, EntityKey } from "@/lib/fields"
import { ColumnLabel } from "../constants"
import { integerIdSchema, nameSchema, uuidSchema } from "./helpers"

export const addCustomerSchema = z.object({
  [EntityKey.GOVT_ID]: integerIdSchema(ColumnLabel.GOVT_ID),
  [EntityKey.ID]: uuidSchema(ColumnLabel.USER).optional().or(z.literal("")),
  [EntityKey.NAME]: nameSchema(ColumnLabel.NAME),
  [EntityKey.FATHER_NAME]: nameSchema(ColumnLabel.FATHER_NAME),
  [EntityKey.VILLAGE_ID]: integerIdSchema(ColumnLabel.VILLAGE),
}).refine((data) => {
  const userId = data[EntityKey.ID]
  if (!userId) return true
  const list = useEntitiesStore.getState().entities[ProjectSlug.CUSTOMERS] || []
  const userExists = list.some((item) => {
    const uId = getField(item, EntityKey.ID)
    return uId && String(uId) === String(userId)
  })
  return !userExists
}, {
  message: "A customer already exists for this user",
  path: [EntityKey.ID],
})

export const editCustomerSchema = addCustomerSchema
