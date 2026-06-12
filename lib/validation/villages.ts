import * as z from "zod"
import { State } from "../constants"

export const addVillageSchema = z.object({
  name: z.string().min(3, "Village name must be at least 3 characters").max(255, "Village name must be 255 characters or less"),
  state: z.enum(State, { message: "State plate code is required" }),
})

export const editVillageSchema = addVillageSchema
