import { Request, Response } from "express"
import PortfolioController from "./PortfolioController"
import PortflioService from "@services/portfolio/PortfolioService"
import { Logger } from "@utils/utils"
import User from "@services/user/models/User"
import Portfolio from "@services/portfolio/models/Porfolio"

class PortfolioControllerImpl implements PortfolioController {
  logger: Logger
  portfolioService: PortflioService

  constructor({
    portfolioService,
    portfolioServiceLogger,
  }: {
    portfolioService: PortflioService
    portfolioServiceLogger: Logger
  }) {
    this.portfolioService = portfolioService
    this.logger = portfolioServiceLogger
  }

  async getPortfolio(req: Request, res: Response): Promise<void> {
    try {
      const user: User = "test"

      const portfolio = await this.portfolioService.getPortfolio(user)
      portfolio
        ? res.status(200).send({ porfolio: portfolio })
        : res.status(200).send({ portfolio: "not found" })
    } catch (error) {
      this.logger.error("Error in getPortfolio:", error)
      res.status(500).send("Internal Server Error")
    }
  }

  async updatePortfolio(req: Request, res: Response): Promise<void> {
    try {
      const user: User = "test"
      const portfolio: Portfolio = {
        user: user,
        assets: [{ coin: "BTC", amount: 3 }],
        lastUpdated: new Date().toISOString(),
      }

      if (await this.portfolioService.updatePorfolio(user, portfolio))
        res.status(200).send({ status: "profile updated" })
      else res.status(200).send({ status: "portfolio not updated" })
    } catch (error) {
      this.logger.error("Error in updatePortfolio:", error)
      res.status(500).send("Internal Server Error")
    }
  }
}

export default PortfolioControllerImpl
