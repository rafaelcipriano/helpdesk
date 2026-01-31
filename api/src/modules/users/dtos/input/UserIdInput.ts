import { z } from "zod"

export const userIdDTO = z.object({ id: z.uuid({ message: "Provide a valid UUID" }) })

export type UserIdInput = z.infer<typeof userIdDTO>