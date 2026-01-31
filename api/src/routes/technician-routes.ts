import { Router } from "express";
import { TechnicianControllers } from "../modules/users/controllers/TechnicianControllers"

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

const technicianRoutes = Router()
const technicianControllers = new TechnicianControllers()

technicianRoutes.post(
  "/", 
  requireAuthentication,
  verifyUserAuthorization(["ADMIN"]),
  validate({ body: createUserDTO }),
  technicianControllers.create
)

technicianRoutes.post(
  "/avatar",
  requireAuthentication, 
  verifyUserAuthorization(["TECHNICIAN"]),
  upload.single("file"),
  technicianControllers.uploadAvatar
)

technicianRoutes.get(
  "/", 
  requireAuthentication, 
  verifyUserAuthorization(["ADMIN"]),
  technicianControllers.index
)

technicianRoutes.patch(
  "/profile/:id", 
  requireAuthentication, 
  verifyUserAuthorization(["TECHNICIAN"]),
  validate({
    params: userIdDTO,
    body: updateProfileDTO
  }),
  technicianControllers.updateProfile
)

technicianRoutes.put(
  "/profile/:id/password", 
  requireAuthentication, 
  verifyUserAuthorization(["TECHNICIAN"]),
  validate({
    params: userIdDTO,
    body: updatePasswordDTO
  }),
  technicianControllers.updatePassword
)

technicianRoutes.delete(
  "/:id", 
  requireAuthentication, 
  verifyUserAuthorization(["ADMIN", "TECHNICIAN"]),
  validate({ params: userIdDTO }),
  technicianControllers.delete
)

export { technicianRoutes }