import { z } from "zod"

export const updateServiceDTO = z.object({
  name:
    z.string().min(5, { message: "Give a clear name." }).optional(),
  price:
    z.coerce.number().gt(0).optional()
})

export type UpdateServiceInput = z.infer<typeof updateServiceDTO>

export const paramSchemaDTO = z.object({ id: z.uuid() })

export type ParamSchemaInput = z.infer<typeof paramSchemaDTO>