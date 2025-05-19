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
    logger,
  }: {
    portfolioService: PortflioService
    logger: Logger
  }) {
    this.portfolioService = portfolioService
    this.logger = logger
  }

  async getPortfolio(req: Request, res: Response): Promise<void> {
    try {
      const userString = req.header("X-Crypto-Portfolio-Token") as string
      const user: User = { user: userString }

      const portfolio = await this.portfolioService.getPortfolio(user)
      portfolio
        ? res.status(200).send({ portfolio: portfolio })
        : res.status(200).send({ portfolio: "not found" })
    } catch (error) {
      this.logger.error("Error in getPortfolio:", error)
      res.status(500).send("Internal Server Error")
    }
  }

  async updatePortfolio(req: Request, res: Response): Promise<void> {
    try {
      const username = req.header("X-Crypto-Portfolio-Token") as string
      const portfolio = req.body as Portfolio
      const user: User = { user: username }

      if (await this.portfolioService.updatePortfolio(user, portfolio))
        res.status(200).send({ status: "portfolio updated" })
      else res.status(200).send({ status: "portfolio not updated" })
    } catch (error) {
      this.logger.error("Error in updatePortfolio:", error)
      res.status(500).send("Internal Server Error")
    }
  }
}

export default PortfolioControllerImpl
