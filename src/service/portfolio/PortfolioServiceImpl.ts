import User from "@services/user/models/User"
import Portfolio, { UsdEvaluatedPortfolio } from "./models/Porfolio"
import PortfolioService from "./PortfolioService"
import Repository from "@services/persitance/repository/Repository"
import { Logger } from "@utils/utils"
import KafkaProducerFactory from "@services/updates/kafka/KafkaProducerFactory"
import KakfaConsumerFactory from "@services/updates/kafka/KafkaConsumerFactory"
import CoinPricingService from "@services/pricing/CoinPricingService"
import { CryptoAsset } from "@services/portfolio/models/Porfolio"

class PortfolioServiceImpl implements PortfolioService {
  private portfolioRepository: Repository<Portfolio>
  private portfolioUpdatesProducer: KafkaProducerFactory<Portfolio>
  private portfolioUpdatesConsumer: KakfaConsumerFactory<Portfolio>
  private logger: Logger
  private coinPricingService: CoinPricingService

  constructor({
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
  }) {
    this.portfolioRepository = portfolioRepository
    this.portfolioUpdatesProducer = portfolioUpdatesProducer
    this.portfolioUpdatesConsumer = portfolioUpdatesConsumer
    this.coinPricingService = coinPricingService
    this.portfolioUpdatesConsumer.start(this.consumePortfolioUpdate.bind(this))
    this.logger = logger
  }

  producePortfolioUpdate(): Promise<void> {
    throw new Error("Method not implemented.")
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

  async getPortfolio(user: User): Promise<UsdEvaluatedPortfolio | null> {
    const porfolio = await this.portfolioRepository.find(user)
    if (porfolio) {
      return this.getUsdEvaluatedPortfolio(porfolio)
    }
    return null
  }

  getUsdEvaluatedPortfolio(portfolio: Portfolio): UsdEvaluatedPortfolio {
    this.logger.info(`Evaluating ${portfolio.user}'s portfolio.`)
    const evaluatedPortfolio: UsdEvaluatedPortfolio = {
      portfolio: portfolio,
      evaluation: {
        assets: [],
        totalUsd: 0,
        evaluatedTs: new Date().toISOString(),
      },
    }

    portfolio.assets.forEach((asset: CryptoAsset) => {
      const coinPrice = this.coinPricingService.getCoinPrice(asset.coin)

      // If it exists in our coinPriceService/cache
      if (coinPrice !== null) {
        const coinUsdAmount = asset.amount * coinPrice
        evaluatedPortfolio.evaluation.assets.push({
          coin: asset.coin,
          amountInUsd: coinUsdAmount,
        })

        evaluatedPortfolio.evaluation.totalUsd += coinUsdAmount
      }
    })

    return evaluatedPortfolio
  }
}

export default PortfolioServiceImpl
