import jwt from "jsonwebtoken"
import { AppError } from "../../../utils/AppError"
import { prisma } from "../../../lib/prisma"
import { auth } from "../../../config/auth"
import { compare } from "bcrypt"

import  { CreateSessionInput } from "../dtos/CreateSessionInput"

class SessionUseCase {
  async create({ email, password }: CreateSessionInput): Promise<string> {
    const users = [
      await prisma.administrator.findUnique({ where: { email } }),
      await prisma.technician.findUnique({ where: { email } }),
      await prisma.customer.findUnique({ where: { email } })
    ]

    const user = users.filter((user: object | null) => user?.hasOwnProperty("id"))

    if (!user[0]) {
      throw new AppError("Error, user not found", 404)
    }

    const passwordMatched = await compare(password, user[0].password)

    if (!passwordMatched) {
      throw new AppError("Email or password invalid", 401)
    }

    const { secret } = auth.jwt

    const token = jwt.sign(
      {
        role: user[0].role ?? "CUSTOMER" 
      },
      secret,
      {
        subject: user[0].id,
        expiresIn: "1d"
      }
    );

    return token
  }
}

export { SessionUseCase }