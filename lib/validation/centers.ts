import * as z from "zod"
import { useEntitiesStore, getField } from "@/lib/store"
import { ProjectSlug } from "@/lib/fields"

const baseCenterSchema = z.object({
  name: z.string().min(3, "Center name must be at least 3 characters").max(255, "Center name must be 255 characters or less"),
  factory_id: z.coerce.number({ message: "Factory ID must be an integer" }).int("Factory ID must be an integer").positive("Factory ID must be a positive integer"),
})

export const addCenterSchema = baseCenterSchema.refine((data) => {
  const currentList = useEntitiesStore.getState().entities[ProjectSlug.CENTERS] || []
  const centerExists = currentList.some((item) => {
    const existingName = getField(item, "name")
    const existingFactoryId = getField(item, "factory_id")
    return (
      typeof existingName === "string" &&
      existingName.trim().toLowerCase() === data.name.trim().toLowerCase() &&
      String(existingFactoryId) === String(data.factory_id)
    )
  })
  return !centerExists
}, {
  message: "A center with this name and factory ID already exists",
  path: ["name"],
})

export const editCenterSchema = baseCenterSchema

