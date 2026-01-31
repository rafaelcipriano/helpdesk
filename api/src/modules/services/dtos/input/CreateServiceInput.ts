import { z } from "zod"

export const createServiceDTO = z.object({
  name: 
    z.string().min(5, { message: "Give a clear name." }),
  price:
    z.coerce.number().gt(0)
})

export type CreateServiceInput = z.infer<typeof createServiceDTO>