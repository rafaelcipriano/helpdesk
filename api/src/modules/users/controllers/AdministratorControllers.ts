import { Request, Response } from "express"

import { prisma } from "../../../lib/prisma"
import { UserUseCase } from "../useCases/UserUseCase"

const userUseCase = new UserUseCase(prisma.administrator)

class AdministratorControllers {
  async create(req: Request, res: Response) {
    const data = req.body

    const administrator = await userUseCase.create(data)
    
    return res.status(201).json(administrator)
  }

  async index(req: Request, res: Response) {
    const administrators = await userUseCase.index()

    return res.json(administrators)
  }

  async uploadAvatar(req: Request, res: Response) {
    const id = req.user?.id
    const { file } = req
    
    const avatar = await userUseCase.uploadAvatar(file, id)

    return res.status(201).json(avatar)
  }

  async updateProfile(req: Request, res: Response) {
    const { id } = req.params
    const { name, email } = req.body

    const user = await userUseCase.updateProfile({ id }, { name, email })

    return res.status(200).json(user)
  }

  async updatePassword(req: Request, res: Response) {
    const { id } = req.params
    const { currentPassword, password } = req.body

    const user = await userUseCase.updatePassword({ id }, { currentPassword, password })

    return res.status(200).json(user)
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params

    const user = await userUseCase.delete({ id })

    return res.status(200).json(user)
  }
}

export { AdministratorControllers }