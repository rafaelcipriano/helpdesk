import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { auth } from "../config/auth"
import { AppError } from "../utils/AppError"

function requireAuthentication(
  request: Request,
  response: Response,
  next: NextFunction
) {
  interface TokenPayload {
    role: string
    sub: string
  }

  const token = request.headers.authorization

  if (!token) {
    throw new AppError("no token provided", 401)
  }
  
  try {
    const accessToken = token?.split(" ")[1]
    const decoded = jwt.verify(accessToken, auth.jwt.secret) as TokenPayload

    request.user = {
      id: decoded.sub,
      role: decoded.role
    }
    
    next()
  } catch (error) {
    throw new AppError("invalid token", 401)
  }
}

export { requireAuthentication }