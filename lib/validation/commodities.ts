import * as z from "zod"
import { useEntitiesStore, getField } from "@/lib/store"
import { ProjectSlug } from "@/lib/fields"

const commodityNameField = z.string().min(1, "Commodity name is required").max(100, "Commodity name must be 100 characters or less")

export const addCommoditySchema = z.object({
  name: commodityNameField,
}).refine((data) => {
  const currentList = useEntitiesStore.getState().entities[ProjectSlug.COMMODITIES] || []
  const nameExists = currentList.some((item) => {
    const existingName = getField(item, "name")
    return (
      typeof existingName === "string" &&
      existingName.trim().toLowerCase() === data.name.trim().toLowerCase()
    )
  })
  return !nameExists
}, {
  message: "A commodity with this name already exists",
  path: ["name"],
})

export const editCommoditySchema = z.object({
  name: commodityNameField,
})


