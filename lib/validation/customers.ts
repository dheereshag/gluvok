import * as z from "zod"
import { useEntitiesStore, getField } from "@/lib/store"
import { ProjectSlug, EntityKey } from "@/lib/fields"
import { ColumnLabel } from "../constants"
import { integerIdSchema, nameSchema, uuidSchema } from "./helpers"

const baseCustomerSchema = z.object({
  [EntityKey.GOVT_ID]: integerIdSchema(ColumnLabel.GOVT_ID),
  [EntityKey.ID]: uuidSchema(ColumnLabel.USER).optional().or(z.literal("")),
  [EntityKey.NAME]: nameSchema(ColumnLabel.NAME),
  [EntityKey.FATHER_NAME]: nameSchema(ColumnLabel.FATHER_NAME),
  [EntityKey.VILLAGE_ID]: integerIdSchema(ColumnLabel.VILLAGE),
})

export const addCustomerSchema = baseCustomerSchema
  .refine((data) => {
    const govtIdVal = data[EntityKey.GOVT_ID]
    const list = useEntitiesStore.getState().entities[ProjectSlug.CUSTOMERS] || []
    return !list.some((item) => String(getField(item, EntityKey.GOVT_ID)) === String(govtIdVal))
  }, {
    message: "A customer with this Govt ID already exists",
    path: [EntityKey.GOVT_ID],
  })
  .refine((data) => {
    const userId = data[EntityKey.ID]
    if (!userId) return true
    const list = useEntitiesStore.getState().entities[ProjectSlug.CUSTOMERS] || []
    return !list.some((item) => {
      const uId = getField(item, EntityKey.ID)
      return uId && String(uId) === String(userId)
    })
  }, {
    message: "A customer already exists for this user",
    path: [EntityKey.ID],
  })

export const editCustomerSchema = baseCustomerSchema
