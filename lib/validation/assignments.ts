import * as z from "zod"
import { useEntitiesStore, getField } from "@/lib/store"
import { ProjectSlug, EntityKey } from "@/lib/fields"
import { ColumnLabel } from "../constants"
import { integerIdSchema } from "./helpers"

const baseAssignmentSchema = z.object({
  [EntityKey.FACTORY_ID]: integerIdSchema(ColumnLabel.FACTORY),
  [EntityKey.PROFILE_ID]: z
    .preprocess(
      (val) => typeof val === "string" ? val.replace(/\s/g, "") : val,
      z.string().length(12, `${ColumnLabel.PROFILE} Aadhar number must be exactly 12 characters`)
    ),
})

export const addAssignmentSchema = baseAssignmentSchema.refine((data) => {
  const currentList = useEntitiesStore.getState().entities[ProjectSlug.ASSIGNMENTS] || []
  const assignmentExists = currentList.some((item) => {
    const existingFactoryId = getField(item, EntityKey.FACTORY_ID)
    const existingProfileId = getField(item, EntityKey.PROFILE_ID)
    return (
      String(existingFactoryId) === String(data[EntityKey.FACTORY_ID]) &&
      String(existingProfileId || "").replace(/\s/g, "").toLowerCase() === String(data[EntityKey.PROFILE_ID] || "").replace(/\s/g, "").toLowerCase()
    )
  })
  return !assignmentExists
}, {
  message: "This profile is already assigned to this factory",
  path: [EntityKey.PROFILE_ID],
})

export const editAssignmentSchema = baseAssignmentSchema
