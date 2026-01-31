/**
 * Middleware genérico para validação de Schemas do Zod.
 * @param {ZodObject<any, any>} schema - O schema de objeto do Zod para validação.
 */
import { Request, Response, NextFunction } from "express"
import { z, ZodError, ZodObject } from "zod"

type ValidationSchemas = {
  body?: ZodObject,
  params?: ZodObject,
  query?: ZodObject
}

export const validate = (schemas: ValidationSchemas) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      
      if (schemas.body)
        await schemas.body?.parseAsync(request.body)

      if (schemas.params)
        await schemas.params?.parseAsync(request.params)

      if (schemas.query)
        await schemas.query?.parseAsync(request.query)
      
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return response.status(400).json({
          message: "validation error",
          zod: z.treeifyError(error)
        })
      }
    }
  }
}