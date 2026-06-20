import * as z from "zod"
import { useEntitiesStore, getField } from "@/lib/store"
import { ProjectSlug, EntityKey } from "@/lib/fields"
import { ColumnLabel } from "../constants"
import { integerIdSchema, uuidSchema } from "./helpers"

const baseAssignmentSchema = z.object({
  [EntityKey.FACTORY_ID]: integerIdSchema(ColumnLabel.FACTORY),
  [EntityKey.USER_ID]: uuidSchema(ColumnLabel.USER),
})

export const addAssignmentSchema = baseAssignmentSchema.refine((data) => {
  const currentList = useEntitiesStore.getState().entities[ProjectSlug.ASSIGNMENTS] || []
  const assignmentExists = currentList.some((item) => {
    const existingFactoryId = getField(item, EntityKey.FACTORY_ID)
    const existingUserId = getField(item, EntityKey.USER_ID)
    return (
      String(existingFactoryId) === String(data[EntityKey.FACTORY_ID]) &&
      String(existingUserId) === String(data[EntityKey.USER_ID])
    )
  })
  return !assignmentExists
}, {
  message: "This user is already assigned to this factory",
  path: [EntityKey.USER_ID],
})

export const editAssignmentSchema = baseAssignmentSchema
