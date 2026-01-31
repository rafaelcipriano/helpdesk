import { Router } from "express";
import { CustomerControllers } from "../modules/users/controllers/CustomerControllers"

import { requireAuthentication } from "../middlewares/requireAuthentication"
import { verifyUserAuthorization } from "../middlewares/verifyUserAuthorization"
import { validate } from "../middlewares/validate"

import { userIdDTO } from "../modules/users/dtos/input/UserIdInput"
import { updateProfileDTO } from "../modules/users/dtos/input/UpdateProfileInput"
import { updatePasswordDTO } from "../modules/users/dtos/input/UpdatePasswordInput"

import multer from "multer"
import uploadConfig from "../config/upload"

const upload = multer(uploadConfig.MULTER)

const customerRoutes = Router()
const customerControllers = new CustomerControllers()

customerRoutes.post(
  "/avatar", 
  requireAuthentication,
  verifyUserAuthorization(["CUSTOMER"]),
  upload.single("file"),
  customerControllers.uploadAvatar
)

customerRoutes.get(
  "/", 
  requireAuthentication, 
  verifyUserAuthorization(["ADMIN"]),
  customerControllers.index
)

customerRoutes.patch(
  "/profile/:id",
  requireAuthentication,
  verifyUserAuthorization(["CUSTOMER"]),
  validate({
    params: userIdDTO,
    body: updateProfileDTO
  }),
  customerControllers.updateProfile
)

customerRoutes.put(
  "/profile/:id/password", 
  requireAuthentication, 
  verifyUserAuthorization(["CUSTOMER"]),
  validate({
    params: userIdDTO,
    body: updatePasswordDTO
  }),
  customerControllers.updatePassword
)

customerRoutes.delete(
  "/:id", 
  requireAuthentication, 
  verifyUserAuthorization(["ADMIN"]),
  validate({ params: userIdDTO }),
  customerControllers.delete
)

export { customerRoutes }