import { Request, Response } from "express"
import { prisma } from "../../../lib/prisma"

import { CallUseCase } from "../useCases/CallUseCase"

class CallsControllers {
  async create(req: Request, res: Response) {
    const data = req.body

    const callService = new CallUseCase()
    const call = await callService.create(data)

    return res.status(201).json(call)
  }

  async addService(req: Request, res: Response) {
    const data = req.body
    const userId: any = req.user?.id

    const callService = new CallUseCase()
    const call = await callService.addService(userId, data)

    return res.status(200).json(call)
  }

  async removeService(req: Request, res: Response) {
    const data = req.body
    const userId: any = req.user?.id

    const callService = new CallUseCase()
    const call = await callService.removeService(userId, data)

    return res.status(200).json(call)
  }

  async toggleStatus(req: Request, res: Response) {
    const { callId } = req.params
    const userId: any = req.user?.id
    
    const callService = new CallUseCase()
    const call = await callService.toggleStatus({ callId }, userId)

    return res.status(200).json(call)
  }

  async index(req: Request, res: Response) {
    const calls = await prisma.call.findMany({
      include: { services: true },
      orderBy: { createdAt: 'asc' }
    })

    return res.json(calls)
  }

  async showByTechnician(req: Request, res: Response) {    
    const { userId } = req.params

    const callService = new CallUseCase()
    const calls = await callService.showByTechnician({ userId })

    return res.json(calls)
  }

  async showByCustomer(req: Request, res: Response) {
    const { userId } = req.params
    
    const callService = new CallUseCase()
    const calls = await callService.showByCustomer({ userId })

    return res.json(calls)
  }
}

export { CallsControllers }