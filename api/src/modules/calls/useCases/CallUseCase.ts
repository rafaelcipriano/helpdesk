import { Prisma } from "../../../../generated/prisma"
import { prisma } from "../../../lib/prisma"
import { AppError } from "../../../utils/AppError"

import { CreateCallInput } from "../dtos/input/CreateCallInput"
import { UpdateServiceInput } from "../dtos/input/UpdateServiceInput"
import { ToggleStatusInput } from "../dtos/input/ToggleStatusInput"
import { ShowByUserInput } from "../dtos/input/ShowByUser"

import { CreateCallOutput } from "../dtos/output/CreateCallOutput"
import { UpdateServiceOutput } from "../dtos/output/UpdateServiceOutput"
import { ToggleStatusOutput } from "../dtos/output/ToggleStatusOutput"

import { CallMapper } from "../mappers/CallMapper"

export class CallUseCase {
  async getAvailableTechnician(tx: Prisma.TransactionClient): Promise<string> {
    // Escolhe o técnico com menos chamados ABERTOS (OPEN ou IN_PROGRESS)
    const result = await tx.$queryRaw<
      { id: string }[]
    >`
      SELECT t.id
      FROM "technicians" t
      ORDER BY (
        SELECT COUNT(*) FROM "calls" c WHERE c."technicianId" = t.id AND c.status IN ('OPEN', 'IN_PROGRESS')
      )
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    `

    if (!result.length) {
      throw new AppError("Technician not found!", 404)
    }

    return result[0].id
  }

  async create({ title, description, services, customerId }: CreateCallInput): Promise<CreateCallOutput> {
    return await prisma.$transaction(async (tx) => {
      
      const foundService = await tx.service.findMany({ where: { id: { in: services } } })
  
      if(foundService.length === 0) {
        throw new AppError("Service not found!", 404)
      }
  
      const service = foundService[0]
  
      const unavailableService = service.status === "UNAVAILABLE"
  
      if (unavailableService) {
        throw new AppError(`${service.name} is not AVAILABLE`)
      }
  
      const technicianId = await this.getAvailableTechnician(tx)
  
      const query = await tx.call.create({
        data: {
          title,
          description,
          price: service.price,
          customerId,
          technicianId,
          services: { connect: services.map( id => ({ id }) ) }
        },
        include : { services: true }
      })
  
      const call = new CallMapper().createCallDTO(query)
  
      return call
    })
  }

  async addService(userId: string, { callId, serviceId }: UpdateServiceInput): Promise<UpdateServiceOutput> {
    const foundCall    = await prisma.call.findUnique({ where: { id: callId } })
    const foundService = await prisma.service.findUnique({ where: { id: serviceId } })

    if (!foundCall) {
      throw new AppError("Call not found!", 404)
    }

    if (!foundService) {
      throw new AppError("Service not found!", 404)
    }

    if (foundCall?.technicianId !== userId) {
      throw new AppError("Only the technician responsible for the ticket can add a service")
    }

    const servicePrice: number = Number(foundService.price)

    const query = await prisma.call.update({
      data: {
        price: {
          increment: servicePrice
        },
        services: {
          connect: { id: foundService.id }
        }
      }, where: { id: callId }
    })

    const call = new CallMapper().updateCallDTO(query)

    return call
  }

  async removeService(userId: string, { callId, serviceId }: UpdateServiceInput): Promise<UpdateServiceOutput> {
    const foundCall = await prisma.call.findUnique({ where: { id: callId } })
    const foundService = await prisma.service.findUnique({ where: { id: serviceId } })

    if (!foundCall) {
      throw new AppError("Call not found!", 404)
    }

    if (!foundService) {
      throw new AppError("Service not found!", 404)
    }

    if (foundCall?.technicianId !== userId) {
      throw new AppError("Only the technician responsible for the ticket can remove a service")
    }

    const servicePrice: number = Number(foundService.price)

    const query = await prisma.call.update({
      data: {
        price: {
          decrement: servicePrice
        },
        services: {
          disconnect: { id: serviceId }
        }
      },
      where: {
        id: callId  
      }
    })

    const call = new CallMapper().updateCallDTO(query)

    return call
  }

  async toggleStatus({ callId }: ToggleStatusInput, userId: string): Promise<ToggleStatusOutput | string> {
    const call = await prisma.call.findUnique({ where: { id: callId } })
    let query

    if (!call) {
      throw new AppError("Call not found!", 404)
    }

    if (call.technicianId !== userId) {
      throw new AppError("Only the technician responsible for the ticket can change the ticket status")
    }

    switch(call.status) {
      case "OPEN": 
        query = await prisma.call.update({
          data: {
            status: "IN_PROGRESS"
          }, where: {
            id: callId
          }
        })

        return new CallMapper().updateCallDTO(query)  
      case "IN_PROGRESS":
        query = await prisma.call.update({
          data: {
            status: "CLOSED"
          }, where: {
            id: callId
          }
        })

        return new CallMapper().updateCallDTO(query)
      default:
        return "This call is closed"
    }
  }

  async showByTechnician({ userId }: ShowByUserInput): Promise<object> {
    const foundTechnician = await prisma.technician.findUnique({ 
      where: { id: userId }
    })
        
    if (!foundTechnician) {
      throw new AppError("Technician not found!", 404)
    }
    
    const query = await prisma.call.findMany({
      where: { technicianId: userId },
      include: { services: true },
      orderBy: { createdAt: 'asc' }
    })
    
    if (!query) {
      throw new AppError("You don't have any calls yet")
    }

    const calls = await new CallMapper().showByUserDTO(query)

    return calls
  }

  async showByCustomer({userId}: ShowByUserInput): Promise<object> {
    const foundCustomer = await prisma.customer.findUnique({ 
      where: { id: userId },
    })

    if (!foundCustomer) {
      throw new AppError("Client not found!", 404)
    }

    const query = await prisma.call.findMany({
      where: { customerId: userId },
      include: {
        services: true
      },
      orderBy: { createdAt: 'asc' }
    })

    if (!query) {
      throw new AppError("You don't have any calls yet")
    }

    const calls = await new CallMapper().showByUserDTO(query)

    return calls
  }
}