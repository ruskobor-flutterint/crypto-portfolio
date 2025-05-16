import conf from "./config/config"
import express from "express"
import bunyan from "bunyan"
import UserRouter from "@routes/UserRouter"
import PortfolioRouter from "@routes/PortfolioRouter"
import { createContainer } from "awilix"

const appLog = bunyan.createLogger({
  name: "APP",
})

const app = express()
const port = conf.port

// DI container
const container = createContainer({
  injectionMode: "PROXY",
  strict: true,
})



// Routers setup
app.use(new UserRouter().getRouter())
app.use(new PortfolioRouter().getRouter())

app.listen(port, () => {
  appLog.info(`crypto-porfolio listening on port ${port}`)
})
