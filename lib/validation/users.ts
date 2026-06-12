import * as z from "zod"
import { Role } from "../constants"

export const addUserSchema = z.object({
  email: z.string().email("Please provide a valid email format"),
  role: z.enum(Role, { message: "Role selection is required" }),
})

export const editUserSchema = addUserSchema
