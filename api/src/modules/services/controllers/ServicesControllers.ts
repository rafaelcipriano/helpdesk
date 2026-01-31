import { Request, Response } from "express"
import { prisma } from "../../../lib/prisma"
import { ServiceUseCase } from "../useCases/ServicesUseCase"

class ServicesControllers {
  async create(req: Request, res: Response) {
    const data = req.body

    const serviceUseCase = new ServiceUseCase()
    const service = await serviceUseCase.create(data)

    return res.status(201).json(service)
  }

  async index(req: Request, res: Response) {
    const services = await prisma.service.findMany()

    return res.json(services)
  }

  async update(req: Request, res: Response) {
    const { id } = req.params
    const data = req.body

    const serviceUseCase = new ServiceUseCase()
    const service = await serviceUseCase.update({ id }, data)

    return res.json(service)
  }

  async toggleStatus(req: Request, res: Response) {
    const { id } = req.params
    
    const serviceUseCase = new ServiceUseCase()
    const service = await serviceUseCase.toggleStatus({ id })

    return res.json(service)
  }
  
  async delete(req: Request, res: Response) {
    const { id } = req.params
    
    const serviceUseCase = new ServiceUseCase()
    const service = await serviceUseCase.delete({ id })

    return res.json(service)
  }
}

export { ServicesControllers}