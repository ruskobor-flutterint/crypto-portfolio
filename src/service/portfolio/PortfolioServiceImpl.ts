import User from "@services/user/models/User"
import Portfolio from "./models/Porfolio"
import PortfolioService from "./PortfolioService"
import Repository from "@services/persitance/Repository/Repository"
import { Logger } from "@utils/utils"

class PortfolioServiceImpl implements PortfolioService {
  portfolioRepository: Repository<Portfolio>
  logger: Logger

  constructor({
    portfolioRepository,
    portfolioServiceLogger,
  }: {
    portfolioRepository: Repository<Portfolio>
    portfolioServiceLogger: Logger
  }) {
    this.portfolioRepository = portfolioRepository
    this.logger = portfolioServiceLogger
  }

  async updatePorfolio(user: User, portfolio: Portfolio): Promise<boolean> {
    if (await this.portfolioRepository.find({ user: user })) {
      this.logger.info(`Updating ${user}'s portfolio `, portfolio)
      if (await this.portfolioRepository.update({ user }, portfolio))
        return true
    }
    return false
  }

  async getPortfolio(user: User): Promise<Portfolio | null> {
    return this.portfolioRepository.find({ user: user })
  }
}

export default PortfolioServiceImpl
