import { z } from "zod"

export const updateServiceDTO = z.object({
  callId: z.uuid({ message: "The ID given is not in the standard UUID" }),
  serviceId: z.uuid({ message: "The ID given is not in the standard UUID" })
})

export type UpdateServiceInput = z.infer<typeof updateServiceDTO>