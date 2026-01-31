import { AppError } from "../../../utils/AppError"
import { prisma } from "../../../lib/prisma"

import { CreateServiceInput } from "../dtos/input/CreateServiceInput"
import { UpdateServiceInput, ParamSchemaInput } from "../dtos/input/UpdateServiceInput"

class ServiceUseCase {
  async create({ name, price }: CreateServiceInput) {
    const searchService = await prisma.service.findFirst({
      where: {
        name: {
          contains: name,
          mode: "insensitive"
        }
      }
    })

    const compare = searchService?.name.toLocaleLowerCase() === name.toLowerCase()

    if (compare) {
      throw new AppError(`${name} already exists!`)
    }

    const service = await prisma.service.create({
      data: {
        name,
        price
      }
    })

    return service
  }

  async update(
    id: ParamSchemaInput,
    { name, price }: UpdateServiceInput
  ) {
    let service = await prisma.service.findUnique({ where: id })

    if (!service) {
      throw new AppError("Service not found!", 404)
    }

    const searchService = await prisma.service.findFirst({
      where: {
        name: {
          contains: name,
          mode: "insensitive"
        }
      }
    })

    const compare = searchService?.name.toLowerCase() === service.name.toLocaleLowerCase()

    if (compare) {
      throw new AppError(`${name} already exists!`)
    }

    service = await prisma.service.update({
      data: {
        name,
        price
      }, where: id
    })

    return service
  }

  async toggleStatus(id: ParamSchemaInput) {
    let service = await prisma.service.findUnique({ where: id })

    if (!service) {
      throw new AppError("Service not found!", 404)
    }

    const status = service.status

    switch(status) {
      case "AVAILABLE":
        return service = await prisma.service.update({
          data: {
            status: "UNAVAILABLE"
          }, where: id
        })

      case "UNAVAILABLE":
        return service = await prisma.service.update({
          data: {
            status: "AVAILABLE"
          }, where: id
        })

      default:
        return { 
          message: "Não foi possível atualizar o status do serviço." 
        }
    }
  }

  async delete(id: ParamSchemaInput) {
    const service = await prisma.service.findUnique({ where: id })

    if (!service) {
      throw new AppError("Service not found!", 404)
    }

    await prisma.service.delete({ where: id })

    return `${service.name} was deleted from the database`
  }
}

export { ServiceUseCase }