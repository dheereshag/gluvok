import * as z from "zod"
import { Role, ColumnLabel } from "../constants"
import { EntityKey, ProjectSlug } from "@/lib/fields"
import { useEntitiesStore, getField } from "@/lib/store"

const baseUserSchema = z.object({
  [EntityKey.EMAIL]: z.email(`Please provide a valid ${ColumnLabel.EMAIL.toLowerCase()} format`),
  [EntityKey.ROLE]: z.enum(Role, { message: `${ColumnLabel.ROLE} selection is required` }),
})

export const addUserSchema = baseUserSchema.refine((data) => {
  const emailVal = data[EntityKey.EMAIL]?.trim().toLowerCase()
  if (!emailVal) return true
  const list = useEntitiesStore.getState().entities[ProjectSlug.USERS] || []
  return !list.some((u) => {
    const email = getField(u, EntityKey.EMAIL)
    return typeof email === "string" && email.trim().toLowerCase() === emailVal
  })
}, {
  message: "A user with this email already exists",
  path: [EntityKey.EMAIL],
})

export const editUserSchema = baseUserSchema
