import { z } from "zod"

export const showByUserDTO = z.object({
  userId: z.uuid({ message: "The ID given is not in the standard UUID" })
})

export type ShowByUserInput = z.infer<typeof showByUserDTO>