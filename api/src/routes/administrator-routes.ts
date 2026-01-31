import { Router } from "express";
import { AdministratorControllers } from "../modules/users/controllers/AdministratorControllers"

import { requireAuthentication } from "../middlewares/requireAuthentication"
import { verifyUserAuthorization } from "../middlewares/verifyUserAuthorization"
import { validate } from "../middlewares/validate"

import { userIdDTO } from "../modules/users/dtos/input/UserIdInput"
import { createUserDTO } from "../modules/users/dtos/input/CreateUserInput"
import { updateProfileDTO } from "../modules/users/dtos/input/UpdateProfileInput"
import { updatePasswordDTO } from "../modules/users/dtos/input/UpdatePasswordInput"

import multer from "multer"
import uploadConfig from "../config/upload"
const upload = multer(uploadConfig.MULTER)

const administratorRoutes = Router()
const administratorControllers = new AdministratorControllers()

administratorRoutes.post(
  "/", 
  requireAuthentication,
  verifyUserAuthorization(["ADMIN"]),
  validate({ body: createUserDTO }),
  administratorControllers.create
)

administratorRoutes.post(
  "/avatar", 
  requireAuthentication, 
  verifyUserAuthorization(["ADMIN"]),
  upload.single("file"),
  administratorControllers.uploadAvatar
)

administratorRoutes.get(
  "/", 
  requireAuthentication, 
  verifyUserAuthorization(["ADMIN"]),
  administratorControllers.index
)

administratorRoutes.patch(
  "/profile/:id", 
  requireAuthentication, 
  verifyUserAuthorization(["ADMIN"]),
  validate({
    params: userIdDTO,
    body: updateProfileDTO
  }),
  administratorControllers.updateProfile
)

administratorRoutes.put(
  "/profile/:id/password", 
  requireAuthentication, 
  verifyUserAuthorization(["ADMIN"]),
  validate({
    params: userIdDTO,
    body: updatePasswordDTO
  }),
  administratorControllers.updatePassword
)

administratorRoutes.delete(
  "/:id", 
  requireAuthentication, 
  verifyUserAuthorization(["ADMIN"]),
  validate({ params: userIdDTO }),
  administratorControllers.delete
)

export { administratorRoutes }