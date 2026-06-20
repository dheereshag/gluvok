import * as z from "zod"
import { useEntitiesStore, getField } from "@/lib/store"
import { ProjectSlug, EntityKey } from "@/lib/fields"
import { ColumnLabel } from "../constants"
import { integerIdSchema, nameSchema } from "./helpers"

const baseCenterSchema = z.object({
  [EntityKey.NAME]: nameSchema(ColumnLabel.NAME),
  [EntityKey.FACTORY_ID]: integerIdSchema(ColumnLabel.FACTORY),
})

export const addCenterSchema = baseCenterSchema.refine((data) => {
  const currentList = useEntitiesStore.getState().entities[ProjectSlug.CENTERS] || []
  const centerExists = currentList.some((item) => {
    const existingName = getField(item, EntityKey.NAME)
    const existingFactoryId = getField(item, EntityKey.FACTORY_ID)
    return (
      typeof existingName === "string" &&
      existingName.trim().toLowerCase() === data[EntityKey.NAME].trim().toLowerCase() &&
      String(existingFactoryId) === String(data[EntityKey.FACTORY_ID])
    )
  })
  return !centerExists
}, {
  message: "A center with this name and factory ID already exists",
  path: [EntityKey.NAME],
})

export const editCenterSchema = baseCenterSchema
