import * as z from "zod"
import { useEntitiesStore, getField } from "@/lib/store"
import { ProjectSlug, EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { integerIdSchema } from "./helpers"

const baseAffiliationSchema = z.object({
  [EntityKey.FACTORY_ID]: integerIdSchema(ColumnLabel.FACTORY),
  [EntityKey.CUSTOMER_ID]: integerIdSchema(ColumnLabel.CUSTOMER),
})

export const addAffiliationSchema = baseAffiliationSchema.refine((data) => {
  const currentList = useEntitiesStore.getState().entities[ProjectSlug.AFFILIATIONS] || []
  const affiliationExists = currentList.some((item) => {
    const existingFactoryId = getField(item, EntityKey.FACTORY_ID)
    const existingCustomerId = getField(item, EntityKey.CUSTOMER_ID)
    
    return (
      Number(existingFactoryId) === Number(data[EntityKey.FACTORY_ID]) &&
      Number(existingCustomerId) === Number(data[EntityKey.CUSTOMER_ID])
    )
  })
  return !affiliationExists
}, {
  message: "This affiliation already exists for this factory",
  path: [EntityKey.FACTORY_ID],
})

export const editAffiliationSchema = baseAffiliationSchema
