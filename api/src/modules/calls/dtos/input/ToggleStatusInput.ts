import { z } from "zod"

export const toggleStatusDTO = z.object({
  callId: z.uuid({ message: "The ID given is not in the standard UUID" })
})

export type ToggleStatusInput = z.infer<typeof toggleStatusDTO>