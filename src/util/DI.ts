import UserControllerImpl from "@controllers/UserControllerImpl"
import PriceCollectorService from "@services/updates/PriceCollectorService"
import PortfolioInstanceImpl from "@services/portfolio/PortfolioServiceImpl"
import PortfolioService from "@services/portfolio/PortfolioServiceImpl"
import { asClass, asFunction, asValue, createContainer } from "awilix"
import { loggerFactoryV2 } from "./utils"
import PortfolioControllerImpl from "@controllers/PortfolioControllerImpl"
import MongoStore from "@services/persitance/MongoStore"
import Store from "@services/persitance/Store"
import { MongoClient } from "mongodb"
import { Config } from "src/config/config"
import Repository from "@services/persitance/Repository/Repository"
import { Logger } from "@utils/utils"
import Portfolio from "@services/portfolio/models/Porfolio"
import User from "@services/user/models/User"
import UserRepository from "@services/persitance/Repository/UserMongoRespository"
import PortfolioRepository from "@services/persitance/Repository/PortfolioMongoRepository"
import PortfolioServiceImpl from "@services/portfolio/PortfolioServiceImpl"

// DI container
const diContainer = createContainer({
  injectionMode: "PROXY",
  strict: true,
})

export const setupDI = (conf: Config) => {
  type StoreType = MongoClient

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
        userRepositoryLogger,
      }: {
        dbUserCollection: string
        userRepositoryLogger: Logger
      }) => Repository<User>
    ),
    userRepositoryLogger: asFunction(loggerFactoryV2)
      .inject(() => ({
        name: "userRepository",
        options: {},
      }))
      .singleton(),
    //

    collectorService: asClass(PriceCollectorService),

    // Controllers
    userController: asClass(UserControllerImpl),
    portfolioController: asClass(PortfolioControllerImpl),

    // Services - Portfolio
    portfolioService: asClass(PortfolioServiceImpl).singleton(),
    portfolioServiceLogger: asFunction(loggerFactoryV2)
      .inject(() => ({
        name: "portfolioService",
        options: {},
      }))
      .singleton(),
  })
}

// export const getDI = diContainer

export const getDIInstance = <T>(name: string): T => {
  return diContainer.resolve(name)
}
