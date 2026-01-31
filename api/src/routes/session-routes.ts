import { Router } from "express";
import { SessionControllers } from "../modules/session/controllers/SessionController"
import { CustomerControllers } from "../modules/users/controllers/CustomerControllers"

import { validate } from "../middlewares/validate"

import { createSessionDTO } from "../modules/session/dtos/CreateSessionInput"
import { createUserDTO } from "../modules/users/dtos/input/CreateUserInput"

const sessionRoutes = Router()
const sessionControllers = new SessionControllers()
const customerControllers = new CustomerControllers()

sessionRoutes.post(
  "/login",
  validate({
    body: createSessionDTO
  }),
  sessionControllers.create
)

sessionRoutes.post(
  "/signup",
  validate({
    body: createUserDTO
  }),
  customerControllers.create
)

export { sessionRoutes }