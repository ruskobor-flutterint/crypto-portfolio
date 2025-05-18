import User from "@services/user/models/User"
import Portfolio from "./models/Porfolio"
import PortfolioService from "./PortfolioService"
import Repository from "@services/persitance/repository/Repository"
import { Logger } from "@utils/utils"
import KafkaProducerFactory from "@services/updates/kafka/KafkaProducerFactory"
import KakfaConsumerFactory from "@services/updates/kafka/KafkaConsumerFactory"

class PortfolioServiceImpl implements PortfolioService {
  portfolioRepository: Repository<Portfolio>
  portfolioUpdatesProducer: KafkaProducerFactory<Portfolio>
  portfolioUpdatesConsumer: KakfaConsumerFactory<Portfolio>
  logger: Logger

  constructor({
    portfolioRepository,
    portfolioServiceLogger,
    portfolioUpdatesProducer,
    portfolioUpdatesConsumer,
  }: {
    portfolioRepository: Repository<Portfolio>
    portfolioServiceLogger: Logger
    portfolioUpdatesProducer: KafkaProducerFactory<Portfolio>
    portfolioUpdatesConsumer: KakfaConsumerFactory<Portfolio>
  }) {
    this.portfolioRepository = portfolioRepository
    this.portfolioUpdatesProducer = portfolioUpdatesProducer
    this.portfolioUpdatesConsumer = portfolioUpdatesConsumer
    this.portfolioUpdatesConsumer.start(this.consumePortfolioUpdate.bind(this))
    this.logger = portfolioServiceLogger
  }

  async consumePortfolioUpdate(porfolio: Portfolio) {
    await this.portfolioRepository.update({ user: porfolio.user }, porfolio)
  }

  async updatePortfolio(user: User, portfolio: Portfolio): Promise<boolean> {
    if (await this.portfolioRepository.find(user)) {
      this.logger.info(`Updating ${user}'s portfolio `, portfolio)
      if (await this.portfolioRepository.update(user, portfolio)) return true
    }
    return false
  }

  async pushPortfolioUpdateToBroker(portfolio: Portfolio) {
    this.portfolioUpdatesProducer.sendMessage(portfolio)
  }

  async getPortfolio(user: User): Promise<Portfolio | null> {
    this.logger.info(`Kato cqlo probvam tuka updeita po kafka ->`)
    this.portfolioUpdatesProducer.sendMessage({
      user: "test",
      assets: [],
      lastUpdated: "",
    })

    return this.portfolioRepository.find(user)
  }
}

export default PortfolioServiceImpl
