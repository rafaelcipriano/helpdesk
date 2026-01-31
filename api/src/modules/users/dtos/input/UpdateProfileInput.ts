import { z } from "zod"

export const updateProfileDTO = z.object({
  name: z
    .string()
    .min(3, { message: "The name must contain at least 3 letters" }),
  email: z
    .email({ message: "Provide a valid email address" })
    .trim()
})

export type UpdateProfileInput = z.infer<typeof updateProfileDTO>