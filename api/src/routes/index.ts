import { Router } from "express"
import { administratorRoutes } from "./administrator-routes"
import { technicianRoutes } from "./technician-routes"
import { customerRoutes } from "./customer-routes"
import { sessionRoutes } from "./session-routes"
import { servicesRoutes } from "./services-routes"
import { callRoutes } from "./call-routes"

const routes = Router()

routes.use("/administrator", administratorRoutes)
routes.use("/technician", technicianRoutes)
routes.use("/customer", customerRoutes)
routes.use("/session", sessionRoutes)
routes.use("/services", servicesRoutes)
routes.use("/calls", callRoutes)

export { routes }