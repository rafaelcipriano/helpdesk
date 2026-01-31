import { z } from "zod"

export const createUserDTO = z.object({
  name: z
    .string()
    .min(3, { message: "The name must contain at least 3 letters" }),
  email: z
    .email({ message: "Provide a valid email address" })
    .trim(),
  password: z
    .string()
    .trim()
    .min(6, { message: "The password must contain at least 6 characters" })
})

export type CreateUserInput = z.infer<typeof createUserDTO>