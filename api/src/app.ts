import express from "express"
import { errorHandler } from "./middlewares/erroHandler"
import { routes } from "./routes/index"

const app = express()

app.use(express.json())
app.use(routes)
app.use(errorHandler)

export { app }