import * as z from "zod"
import { useEntitiesStore, getField } from "@/lib/store"
import { ProjectSlug, EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { integerIdSchema } from "./helpers"

const baseAssignmentSchema = z.object({
  [EntityKey.FACTORY_ID]: integerIdSchema(ColumnLabel.FACTORY),
  [EntityKey.PROFILE_ID]: integerIdSchema(ColumnLabel.PROFILE),
})

export const addAssignmentSchema = baseAssignmentSchema.refine((data) => {
  const currentList = useEntitiesStore.getState().entities[ProjectSlug.ASSIGNMENTS] || []
  const assignmentExists = currentList.some((item) => {
    const existingFactoryId = getField(item, EntityKey.FACTORY_ID)
    const existingProfileId = getField(item, EntityKey.PROFILE_ID)
    
    return (
      Number(existingFactoryId) === Number(data[EntityKey.FACTORY_ID]) &&
      Number(existingProfileId) === Number(data[EntityKey.PROFILE_ID])
    )
  })
  return !assignmentExists
}, {
  message: "This assignment already exists for this factory",
  path: [EntityKey.FACTORY_ID],
})

export const editAssignmentSchema = baseAssignmentSchema
