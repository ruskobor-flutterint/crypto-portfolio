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
import PriceCollectorService from "@services/updates/PriceCollectorServiceImpl"
import CoinPricingServiceImpl from "@services/pricing/CoinPricingServiceImpl"
import CoinPricingService from "@services/pricing/CoinPricingService"
import KafkaProducerFactory from "@services/updates/kafka/KafkaProducerFactory"
import KakfaConsumerFactory from "@services/updates/kafka/KafkaConsumerFactory"
import { Kafka } from "kafkajs"
import UserServiceImpl from "@services/user/UserServiceImpl"
import PriceCollectorServiceImpl from "@services/updates/PriceCollectorServiceImpl"

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

    // userRepositoryLogger: asFunction(loggerFactoryV2)
    //   .inject(() => ({
    //     name: "userRepository",
    //     options: {},
    //   }))
    //   .singleton(),

    collectorService: asClass(PriceCollectorServiceImpl),

    // Controllers
    userController: asClass(UserControllerImpl).inject(() => ({
      logger: loggerFactory("userController", {}),
    })),

    portfolioController: asClass(PortfolioControllerImpl).singleton(),

    // Services - Portfolio
    portfolioService: asClass(PortfolioServiceImpl).singleton(),
    portfolioServiceLogger: asFunction(loggerFactoryV2)
      .inject(() => ({
        name: "portfolioService",
        options: {},
      }))
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
        coinPricingServiceLogger,
      }: {
        coinPricingServiceLogger: Logger
      }) => CoinPricingService
    ).singleton(),
    coinPricingServiceLogger: asFunction(loggerFactoryV2)
      .inject(() => ({
        name: "coinPricingService",
        options: {},
      }))
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
  })
}

// export const getDI = diContainer

export const getDIInstance = <T>(name: string): T => {
  return diContainer.resolve(name)
}
