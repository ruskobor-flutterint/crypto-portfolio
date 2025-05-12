import conf from "./config/config"
import express from "express"
import bunyan from "bunyan"

const appLog = bunyan.createLogger({
  name: "APP",
})

const app = express()
const port = conf.port

app.listen(port, () => {
  appLog.info(`crypto-porfolio listening on port ${port}`)
})
