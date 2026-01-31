import { z } from "zod"

export const createSessionDTO = z.object({
  email: z.email({ message: "Provide a valid email" }),
  password: z.string().min(1)
})

export type CreateSessionInput = z.infer<typeof createSessionDTO>