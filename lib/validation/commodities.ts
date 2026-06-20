import * as z from "zod"
import { useEntitiesStore, getField } from "@/lib/store"
import { ProjectSlug, EntityKey } from "@/lib/fields"
import { ColumnLabel } from "../constants"
import { nameSchema } from "./helpers"

const commodityNameField = nameSchema(ColumnLabel.NAME, 1, 100)

export const addCommoditySchema = z.object({
  [EntityKey.NAME]: commodityNameField,
}).refine((data) => {
  const currentList = useEntitiesStore.getState().entities[ProjectSlug.COMMODITIES] || []
  const nameExists = currentList.some((item) => {
    const existingName = getField(item, EntityKey.NAME)
    return (
      typeof existingName === "string" &&
      existingName.trim().toLowerCase() === data[EntityKey.NAME].trim().toLowerCase()
    )
  })
  return !nameExists
}, {
  message: "A commodity with this name already exists",
  path: [EntityKey.NAME],
})

export const editCommoditySchema = z.object({
  [EntityKey.NAME]: commodityNameField,
})
