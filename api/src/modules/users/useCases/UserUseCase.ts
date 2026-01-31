import { hash, compare } from "bcrypt"
import { prisma } from "../../../lib/prisma"
import { AppError } from "../../../utils/AppError"
import { DiskStorage } from "../../../providers/disk-storage"

import { CreateUserInput } from "../dtos/input/CreateUserInput"
import { FileSchemaInput } from "../dtos/input/FileSchemaInput"

import { UserIdInput } from "../dtos/input/UserIdInput"
import { CreateUserOutput } from "../dtos/output/CreateUserOutput"
import { IndexUserOutput } from "../dtos/output/IndexUserOutput"
import { UpdateProfileInput } from "../dtos/input/UpdateProfileInput"
import { UpdatePasswordInput } from "../dtos/input/UpdatePasswordInput"

import { UserMappers } from "../mappers/UserMappers"

class UserUseCase {
  private table: any

  constructor(table: any) {
    this.table = table
  }

  async create({ name, email, password }: CreateUserInput): Promise<CreateUserOutput> {
    const encryptedPassword = await hash(password, 8)

    const emailIsAlreadyInUse = await this.table.findFirst({
      where: { email }
    })

    if (emailIsAlreadyInUse) {
      throw new AppError("Error, this email address it's already in use", 409)
    }

    const user = await this.table.create({
      data: {
        name,
        email,
        password: encryptedPassword
      }
    })

    if (!user) throw new AppError("Error, account not created")

    const userMappers = new UserMappers().createUserDTO(user)

    return userMappers
  }

  async index(): Promise<IndexUserOutput> {
    const users = await this.table.findMany()

    const userMappers = new UserMappers().indexUserDTO(users)

    return userMappers
  }

  async uploadAvatar(file: FileSchemaInput, id: string | undefined): Promise<string | AppError> {
    const diskStorage = new DiskStorage()

    if (!file) {
      throw new AppError("Error! Something in the archive is wrong")
    }

    if (id) {
      const filename = await diskStorage.saveFile(file.filename)
      
      await this.table.update({
        data: {
          avatar: filename
        }, where: { id }
      })

      return filename
    } else {
      throw new AppError("Error! No user id was provided")
    }
  }

  async updateProfile(
    { id }: UserIdInput, 
    { name, email }: UpdateProfileInput
  ): Promise<UpdateProfileInput> {
    const findUser = await this.table.findUnique({ where: { id } })

    if (!findUser) {
      throw new AppError("User not found", 404)
    }

    const emailIsAlreadyInUse = await this.table.findFirst({ where: { email } })

    if (emailIsAlreadyInUse) {
      throw new AppError("Error, this email is already in use")
    }

    const user = await this.table.update({
      data: {
        name,
        email
      }, where: { id }
    })

    const userMappers = new UserMappers().updateProfileDTO(user)

    return userMappers
  }

  async updatePassword(
    { id }: UserIdInput,
    { currentPassword, password }: UpdatePasswordInput
  ): Promise<string> {
    const findUser = await this.table.findUnique({ where: { id } })

    if (!findUser) {
      throw new AppError("Error, user not found", 404)
    }

    const passwordMatched = await compare(currentPassword, findUser.password)

    if (!passwordMatched) {
      throw new AppError("The current password provided is invalid")
    }

    const encryptedPassword = await hash(password, 8)

    await this.table.update({
      data: {
        password: encryptedPassword
      }, where: { id }
    })

    return "Password updated successfully"
  }

  async delete({ id }: UserIdInput): Promise<string> {
    const user = await this.table.findUnique({ where: { id } })

    if (!user) {
      throw new AppError("User not found", 404)
    }

    if (user.role === "CUSTOMER") {
      await prisma.call.deleteMany({ where: { customerId: id } })
    }

    await this.table.delete({ where: { id } })

    return `${user.name} deleted`
  }
}

export { UserUseCase }