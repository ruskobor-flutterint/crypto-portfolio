import dotenv from "dotenv"
dotenv.config()

interface Config {
  port: number
  dbUrl: string
  dbName: string
  dbUserCollection: string
  dbPortfolioCollection: string
  kafkaBrokersUri: string
  kafkaPortfolioUpdatesTopic: string
  kafkaCoinPriceUpdatesTopic: string
  kafkaClientId: string
  kafkaPortfolioUpdatesConsumerGroupId: string
}

const conf: Config = {
  port: Number(process.env.SERVER_PORT || 3013),
  // Db
  dbUrl: process.env.MONGODB_URI || "mongodb://localhost:27017",
  dbName: process.env.DB_NAME || "crypto-portfolio",
  dbUserCollection: process.env.MONGODB_USER_COLLECTION || "user",
  dbPortfolioCollection: process.env.MONGODB_PORFOLIO_COLLECTION || "portfolio",
  // Kafka
  kafkaBrokersUri: process.env.KAFKA_BROKERS_URI || "localhost:9092",
  kafkaPortfolioUpdatesTopic:
    process.env.KAFKA_PORTFOLIO_UPDATES_TOPIC || "topic-portfolio-updates",
  kafkaCoinPriceUpdatesTopic:
    process.env.KAFKA_COIN_PRICE_UPDATES_TOPIC || "topic-coin_price-updates",
  kafkaClientId: process.env.KAFKA_CLIENT_ID || "crypto-portfolio-app",
  kafkaPortfolioUpdatesConsumerGroupId:
    process.env.KAFKA_PORTFOLIO_UPDATES_CONSUMER_GROUP ||
    "group-portfolio-updates-consumer",
}

export { Config }

export default conf
