import * as z from "zod"

export const addProfileSchema = z.object({
  aadhar_number: z
    .preprocess(
      (val) => typeof val === "string" ? val.replace(/\s/g, "") : val,
      z.string()
        .length(12, "Aadhar number must be exactly 12 digits")
        .regex(/^\d+$/, "Aadhar number must contain only digits")
    ),
  id: z.uuid("User ID must be a valid Supabase Auth UUID"),
  name: z.string().min(3, "Full name must be at least 3 characters").max(255, "Name must be 255 characters or less"),
})

export const editProfileSchema = addProfileSchema
