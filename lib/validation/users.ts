import * as z from "zod"
import { Role, ColumnLabel } from "../constants"
import { EntityKey } from "@/lib/fields"

export const addUserSchema = z.object({
  [EntityKey.EMAIL]: z.string().email(`Please provide a valid ${ColumnLabel.EMAIL.toLowerCase()} format`),
  [EntityKey.ROLE]: z.nativeEnum(Role, { message: `${ColumnLabel.ROLE} selection is required` }),
})

export const editUserSchema = addUserSchema
