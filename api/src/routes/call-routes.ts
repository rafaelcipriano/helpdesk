import { Router } from "express"
import { CallsControllers } from "../modules/calls/controllers/CallController"

import { requireAuthentication } from "../middlewares/requireAuthentication"
import { verifyUserAuthorization } from "../middlewares/verifyUserAuthorization"
import { validate } from "../middlewares/validate"

import { createCallDTO } from "../modules/calls/dtos/input/CreateCallInput"
import { updateServiceDTO } from "../modules/calls/dtos/input/UpdateServiceInput"
import { toggleStatusDTO } from "../modules/calls/dtos/input/ToggleStatusInput"
import { showByUserDTO } from "../modules/calls/dtos/input/ShowByUser"

const callRoutes = Router()
const callControllers = new CallsControllers()

callRoutes.use(requireAuthentication)

callRoutes.post(
  "/",
  verifyUserAuthorization(["CUSTOMER"]),
  validate({
    body: createCallDTO
  }),
  callControllers.create
)

callRoutes.put(
  "/add-service",
  verifyUserAuthorization(["TECHNICIAN"]),
  validate({
    body: updateServiceDTO
  }),
  callControllers.addService
)

callRoutes.put(
  "/remove-service",
  verifyUserAuthorization(["TECHNICIAN"]),
  validate({
    body: updateServiceDTO
  }),
  callControllers.removeService
)

callRoutes.put(
  "/status/:callId",
  verifyUserAuthorization(["TECHNICIAN"]),
  validate({
    params: toggleStatusDTO
  }),
  callControllers.toggleStatus
)

callRoutes.get(
  "/",
  verifyUserAuthorization(["ADMIN"]),
  callControllers.index
)

callRoutes.get(
  "/called-by-technician/:userId",
  verifyUserAuthorization(["TECHNICIAN"]),
  validate({
    params: showByUserDTO
  }),
  callControllers.showByTechnician
)

callRoutes.get(
  "/called-by-customer/:userId",
  verifyUserAuthorization(["CUSTOMER"]),
  validate({
    params: showByUserDTO
  }),
  callControllers.showByCustomer
)

export { callRoutes }