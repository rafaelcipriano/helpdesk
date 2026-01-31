import { Request, Response } from "express"

import { SessionUseCase } from "../useCases/SessionUseCase"

const sessionUseCase = new SessionUseCase()

class SessionControllers {
  async create(req: Request, res: Response) {
    const data = req.body

    const token = await sessionUseCase.create(data)

    return res.status(201).json({ token })
  }
}

export { SessionControllers }