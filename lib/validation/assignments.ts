import * as z from "zod"
import { useEntitiesStore, getField } from "@/lib/store"
import { ProjectSlug } from "@/lib/fields"

const baseAssignmentSchema = z.object({
  factory_id: z.coerce.number({ message: "Factory ID must be an integer" }).int("Factory ID must be an integer").positive("Factory ID must be a positive integer"),
  user_id: z.string().uuid("User ID must be a valid UUID"),
})

export const addAssignmentSchema = baseAssignmentSchema.refine((data) => {
  const currentList = useEntitiesStore.getState().entities[ProjectSlug.ASSIGNMENTS] || []
  const assignmentExists = currentList.some((item) => {
    const existingFactoryId = getField(item, "factory_id")
    const existingUserId = getField(item, "user_id")
    return (
      String(existingFactoryId) === String(data.factory_id) &&
      String(existingUserId) === String(data.user_id)
    )
  })
  return !assignmentExists
}, {
  message: "This user is already assigned to this factory",
  path: ["user_id"],
})

export const editAssignmentSchema = baseAssignmentSchema
