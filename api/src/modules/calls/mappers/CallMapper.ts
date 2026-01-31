import { prisma } from "../../../lib/prisma"
import { Prisma } from "../../../../generated/prisma"

import { CreateCallOutput } from "../dtos/output/CreateCallOutput"
import { UpdateServiceOutput } from "../dtos/output/UpdateServiceOutput"
import { ToggleStatusOutput } from "../dtos/output/ToggleStatusOutput"
import { ShowByUserOutput } from "../dtos/output/ShowByUserOutput"
import { AppError } from "../../../utils/AppError"

type CallWithServices = Prisma.CallGetPayload<{
  include: { services: true }
}>

type CallPayload = Prisma.CallGetPayload<{}>

export class CallMapper {
  createCallDTO(call: CallWithServices): CreateCallOutput {
    return {
      id: call.id,
      title: call.title,
      description: call.description,
      service: call.services[0].name,
      price: Number(call.price),
      technician: call.technicianId,
      status: call.status,
      createdAt: call.createdAt,
      updatedAt: call.updatedAt
    }
  }

  updateCallDTO(call: CallPayload): UpdateServiceOutput {
    return {
      id: call.id,
      title: call.title,
      description: call.description,
      status: call.status,
      price: Number(call.price),
      customer: call.customerId,
      technician: call.technicianId,
      createdAt: call.createdAt,
      updatedAt: call.updatedAt
    }
  }

  toggleStatusDTO(call: CallPayload): ToggleStatusOutput {
    return {
      id: call.id,
      title: call.title,
      description: call.description,
      status: call.status,
      price: Number(call.price),
      customer: call.customerId,
      technician: call.technicianId,
      createdAt: call.createdAt,
      updatedAt: call.updatedAt
    }
  }

  async showByUserDTO(calls: CallWithServices[]): Promise<ShowByUserOutput[]> {
    const callsDTO = await Promise.all(calls.map(async (call) => {
      const customer = await prisma.customer.findUnique({ where: { id: call.customerId } })
      const technician = await prisma.technician.findUnique({ where: { id: call.technicianId } })
  
      if (!customer || !technician) {
        throw new AppError("User not found!", 404)
      }

      return {
        id: call.id,
        title: call.title,
        description: call.description,
        status: call.status,
        price: Number(call.price),
        customerName: customer?.name,
        technicianName: technician?.name,
        technicianEmail: technician?.email,
        createdAt: call.createdAt,
        updatedAt: call.updatedAt,
        services: call.services.map((service) => {
          return {
            id: service.id,
            name: service.name,
            price: Number(service.price)
          }
        })
      }

    }))

    return callsDTO
  }
}