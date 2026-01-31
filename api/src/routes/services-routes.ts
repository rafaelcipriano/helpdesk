import { Router } from "express";
import { ServicesControllers } from "../modules/services/controllers/ServicesControllers"

import { requireAuthentication } from "../middlewares/requireAuthentication"
import { verifyUserAuthorization } from "../middlewares/verifyUserAuthorization"
import { validate } from "../middlewares/validate"

import { createServiceDTO } from "../modules/services/dtos/input/CreateServiceInput"
import { updateServiceDTO, paramSchemaDTO } from "../modules/services/dtos/input/UpdateServiceInput"

const servicesRoutes = Router()
const servicesControllers = new ServicesControllers()

servicesRoutes.use(requireAuthentication, verifyUserAuthorization(["ADMIN"]))

servicesRoutes.post(
  "/", 
  validate({
    body: createServiceDTO
  }),
  servicesControllers.create
)

servicesRoutes.get(
  "/", 
  servicesControllers.index
)

servicesRoutes.patch(
  "/:id", 
  validate({
    params: paramSchemaDTO,
    body: updateServiceDTO,
  }),
  servicesControllers.update
)

servicesRoutes.put(
  "/status/:id",
  validate({ 
    params: paramSchemaDTO
  }),
  servicesControllers.toggleStatus
)

servicesRoutes.delete(
  "/:id", 
  validate({ 
    params: paramSchemaDTO
  }),
  servicesControllers.delete
)

export { servicesRoutes }