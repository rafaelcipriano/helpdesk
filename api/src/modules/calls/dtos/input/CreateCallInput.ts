import { z } from "zod"

export const createCallDTO = z.object({
  title: 
    z.string().min(10, { message: "Give a clear and objective title" }),
  description: 
    z.string().min(30, { message: "Give a detail description for the problem" }),
  services: 
    z.array(z.uuid({ message: "The ID given is not in the standard UUID" })).max(1),
  customerId: 
    z.uuid({ message: "The ID given is not in the standard UUID" })
})

export type CreateCallInput = z.infer<typeof createCallDTO>