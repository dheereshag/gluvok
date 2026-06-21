import * as z from "zod"
import { useEntitiesStore, getField } from "@/lib/store"
import { ProjectSlug, EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { integerIdSchema, nameSchema } from "./helpers"

const baseCustomerSchema = z.object({
  [EntityKey.GOVT_ID]: integerIdSchema(ColumnLabel.GOVT_ID),
  [EntityKey.NAME]: nameSchema(ColumnLabel.NAME),
  [EntityKey.FATHER_NAME]: nameSchema(ColumnLabel.FATHER_NAME).optional().or(z.literal("")),
  [EntityKey.VILLAGE_ID]: integerIdSchema(ColumnLabel.VILLAGE),
  [EntityKey.FACTORY_ID]: integerIdSchema(ColumnLabel.FACTORY),
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

export const editCustomerSchema = z.object({
  [EntityKey.ID]: z.coerce.number().optional(),
  [EntityKey.GOVT_ID]: integerIdSchema(ColumnLabel.GOVT_ID),
  [EntityKey.NAME]: nameSchema(ColumnLabel.NAME),
  [EntityKey.FATHER_NAME]: nameSchema(ColumnLabel.FATHER_NAME).optional().or(z.literal("")),
  [EntityKey.VILLAGE_ID]: integerIdSchema(ColumnLabel.VILLAGE),
  [EntityKey.FACTORY_ID]: integerIdSchema(ColumnLabel.FACTORY),
}).refine((data) => {
  const govtIdVal = data[EntityKey.GOVT_ID]
  const list = useEntitiesStore.getState().entities[ProjectSlug.CUSTOMERS] || []
  return !list.some((item) => 
    Number(getField(item, EntityKey.ID)) !== Number(data[EntityKey.ID]) &&
    String(getField(item, EntityKey.GOVT_ID)) === String(govtIdVal)
  )
}, {
  message: "A customer with this Govt ID already exists",
  path: [EntityKey.GOVT_ID],
})
