import { z } from "zod"

export const updatePasswordDTO = z.object({
  currentPassword: z.string().trim(),
  password: z
    .string()
    .trim()
    .min(8, { message: "The password must be at least 8 characters" })
})

export type UpdatePasswordInput = z.infer<typeof updatePasswordDTO>