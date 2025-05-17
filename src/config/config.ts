import dotenv from "dotenv"
dotenv.config()

interface Config {
  port: number
  dbUrl: string
  dbName: string
  dbUserCollection: string
  dbPortfolioCollection: string
}

const conf: Config = {
  port: Number(process.env.SERVER_PORT || 3013),
  dbUrl: process.env.MONGODB_URI || "mongodb://localhost:27017",
  dbName: process.env.DB_NAME || "crypto-portfolio",
  dbUserCollection: process.env.DB_USER_COLLECTION || "users",
  dbPortfolioCollection: process.env.DB_PORTFOLIO_COLLECTION || "portfolio",
}

export { Config }

export default conf
