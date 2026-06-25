import * as z from "zod"
import { EntityKey } from "@/lib/constants/enums"
import { ColumnLabel } from "@/lib/constants/enums"
import { integerIdSchema } from "./helpers"

const baseAssignmentSchema = z.object({
  [EntityKey.FACTORY_ID]: integerIdSchema(ColumnLabel.FACTORY),
  [EntityKey.PROFILE_ID]: integerIdSchema(ColumnLabel.PROFILE),
})

export const addAssignmentSchema = baseAssignmentSchema

export const editAssignmentSchema = baseAssignmentSchema
