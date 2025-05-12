import dotenv from "dotenv"

interface Config {
  port: number
}

dotenv.config()

const conf: Config = {
  port: Number(process.env.SERVER_PORT || 3013),
}

export default conf
