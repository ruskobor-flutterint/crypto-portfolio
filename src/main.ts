import conf from "./config/config"
import express from "express"
import UserRouter from "@routes/UserRouter"
import PortfolioRouter from "@routes/PortfolioRouter"
import { loggerFactory } from "@utils/utils"
import { setupDI } from "@utils/DI"

// DI setup
setupDI(conf)

const appLog = loggerFactory("app")
const app = express()
const port = conf.port

// Routers setup
app.use(new UserRouter().getRouter())
app.use(new PortfolioRouter().getRouter())

app.listen(port, () => {
  appLog.info(`crypto-porfolio listening on port ${port}`)
})

// let ks = new KafkaService()
// ks.connect()
// ks.sendMessage("test-topic", "Hello KafkaJS user!")
