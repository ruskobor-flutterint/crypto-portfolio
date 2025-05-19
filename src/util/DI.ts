import { asClass, asFunction, asValue, createContainer } from "awilix"
import { MongoClient } from "mongodb"
import { loggerFactoryV2, Logger, loggerFactory } from "@utils/utils"
import PortfolioControllerImpl from "@controllers/PortfolioControllerImpl"
import UserControllerImpl from "@controllers/UserControllerImpl"
import { Config } from "src/config/config"
import PortfolioRepository from "@services/persitance/repository/PortfolioMongoRepository"
import UserRepository from "@services/persitance/repository/UserMongoRespository"
import Repository from "@services/persitance/repository/Repository"
import MongoStore from "@services/persitance/MongoStore"
import Store from "@services/persitance/Store"
import PortfolioServiceImpl from "@services/portfolio/PortfolioServiceImpl"
import Portfolio from "@services/portfolio/models/Porfolio"
import User from "@services/user/models/User"
import CoinPricingServiceImpl from "@services/pricing/CoinPricingServiceImpl"
import CoinPricingService, {
  CoinOffering,
} from "@services/pricing/CoinPricingService"
import KafkaProducerFactory from "@services/updates/kafka/KafkaProducerFactory"
import KakfaConsumerFactory from "@services/updates/kafka/KafkaConsumerFactory"
import { Kafka } from "kafkajs"
import UserServiceImpl from "@services/user/UserServiceImpl"
import CollectorService from "@services/updates/collector/CollectorService"
import CoinMarketCapAPI from "@services/updates/collector/CoinMarketCapAPI"
import PortfolioService from "@services/portfolio/PortfolioService"

// DI container
const diContainer = createContainer({
  injectionMode: "PROXY",
  strict: true,
})

export const setupDI = (conf: Config) => {
  type StoreType = MongoClient
  const kafkaConfig = {
    clientId: conf.kafkaClientId,
    brokers: [conf.kafkaBrokersUri],
  }

  diContainer.register({
    // DB
    dbUri: asValue(conf.dbUrl),
    dbName: asValue(conf.dbName),
    dbUserCollection: asValue(conf.dbUserCollection),
    dbPortfolioCollection: asValue(conf.dbPortfolioCollection),

    dbService: asClass(
      MongoStore as new ({
        dbUri,
        dbName,
        dbLogger,
      }: {
        dbUri: string
        dbName: string
        dbLogger: Logger
      }) => Store<StoreType>
    ).singleton(),

    dbLogger: asFunction(loggerFactoryV2)
      .inject(() => ({
        name: "db",
        options: {},
      }))
      .singleton(),

    // Services - CollectorService - CoinMarketApi
    collectorService: asClass(
      CoinMarketCapAPI as new ({
        apiKey,
        baseUrl,
        logger,
        intervalMs,
        coinPriceUpdatesProducer,
      }: {
        apiKey: string
        baseUrl: string
        logger: Logger
        intervalMs: number
        coinPriceUpdatesProducer: KafkaProducerFactory<CoinOffering>
      }) => CollectorService
    )
      .inject(() => ({
        apiKey: conf.coinMarketCapApiKey,
        baseUrl: conf.coinMarketCapBaseUrl,
        logger: loggerFactory("coinMarketApi", {}),
        intervalMs: conf.collectorServiceTimeoutMs,
      }))
      .singleton(),

    // Repositories - Portfolio
    portfolioRepository: asClass(
      PortfolioRepository as new ({
        dbService,
        dbPortfolioCollection,
        portfolioRepositoryLogger,
      }: {
        dbService: Store<StoreType>
        dbPortfolioCollection: string
        portfolioRepositoryLogger: Logger
      }) => Repository<Portfolio>
    ).singleton(),

    portfolioRepositoryLogger: asFunction(loggerFactoryV2)
      .inject(() => ({
        name: "portfolioRepositry",
        options: {},
      }))
      .singleton(),

    // Repositories - User
    userRepository: asClass(
      UserRepository as new ({
        dbUserCollection,
        dbService,
        logger,
      }: {
        dbUserCollection: string
        dbService: Store<StoreType>
        logger: Logger
      }) => Repository<User>
    )
      .inject(() => ({
        logger: loggerFactory("userRepository"),
      }))
      .singleton(),

    // Controllers - User
    userController: asClass(UserControllerImpl)
      .inject(() => ({
        logger: loggerFactory("userController", {}),
      }))
      .singleton(),

    // Controllers - Portfolio
    portfolioController: asClass(PortfolioControllerImpl)
      .inject(() => ({ logger: loggerFactory("portfolioController", {}) }))
      .singleton(),

    // Services - Portfolio
    portfolioService: asClass(
      PortfolioServiceImpl as new ({
        portfolioRepository,
        logger,
        portfolioUpdatesProducer,
        portfolioUpdatesConsumer,
        coinPricingService,
      }: {
        portfolioRepository: Repository<Portfolio>
        logger: Logger
        portfolioUpdatesProducer: KafkaProducerFactory<Portfolio>
        portfolioUpdatesConsumer: KakfaConsumerFactory<Portfolio>
        coinPricingService: CoinPricingService
      }) => PortfolioService
    )
      .inject(() => ({ logger: loggerFactory("portfolioService", {}) }))
      .singleton(),

    // Services - User
    userService: asClass(UserServiceImpl)
      .inject(() => ({
        logger: loggerFactory("userService", {}),
      }))
      .singleton(),

    // Services - Coin Pricing
    coinPricingService: asClass(
      CoinPricingServiceImpl as new ({
        logger,
        coinPriceUpdatesConsumer,
      }: {
        logger: Logger
        coinPriceUpdatesConsumer: KakfaConsumerFactory<CoinOffering>
      }) => CoinPricingService
    )
      .inject(() => ({ logger: loggerFactory("coinPricingService", {}) }))
      .singleton(),

    //
    kafkaService: asValue(
      new Kafka({
        clientId: conf.kafkaClientId,
        brokers: [conf.kafkaBrokersUri],
      })
    ),

    // Services - KafkaProducer - PortfolioUpdates
    portfolioUpdatesProducer: asClass(KafkaProducerFactory<Portfolio>)
      .inject(() => ({
        topic: conf.kafkaPortfolioUpdatesTopic,
        logger: loggerFactory(`portfolioUpdatesProducer`, {}),
      }))
      .singleton(),

    // Services - KafkaConsumer - PortfolioUpdates
    portfolioUpdatesConsumer: asClass(KakfaConsumerFactory<Portfolio>)
      .inject(() => ({
        topic: conf.kafkaPortfolioUpdatesTopic,
        groupId: conf.kafkaPortfolioUpdatesConsumerGroupId,
        logger: loggerFactory(`portfolioUpdatesConsumer`, {}),
      }))
      .singleton(),

    // Services - KafkaProducer - CoinPriceUpdates
    coinPriceUpdatesProducer: asClass(KafkaProducerFactory<CoinOffering>)
      .inject(() => ({
        topic: conf.kafkaCoinPriceUpdatesTopic,
        logger: loggerFactory(`coinPriceUpdatesProducer`, {}),
      }))
      .singleton(),

    // Services - KafkaConsumer - CoinPriceUpdates
    coinPriceUpdatesConsumer: asClass(KakfaConsumerFactory<CoinOffering>)
      .inject(() => ({
        topic: conf.kafkaCoinPriceUpdatesTopic,
        groupId: conf.kafkaCoinPriceUpdatesTopic,
        logger: loggerFactory(`coinPriceUpdatesConsumer`, {}),
      }))
      .singleton(),
  })
}

// export const getDI = diContainer

export const getDIInstance = <T>(name: string): T => {
  return diContainer.resolve(name)
}
