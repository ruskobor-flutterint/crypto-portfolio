import { Router } from "express"
import BaseRouter from "./BaseRouter"
import PortfolioController from "@controllers/PortfolioController"
import { getDIInstance } from "@utils/DI"
import { authMiddleware } from "@middlewares/Middleware"

class PorfolioRouter extends BaseRouter {
  private portfolioController: PortfolioController

  constructor() {
    super()
    const router = Router()
    this.portfolioController = getDIInstance<PortfolioController>(
      "portfolioController"
    )

    router.get(
      "/portfolio",
      this.portfolioController.getPortfolio.bind(this.portfolioController)
    )

    router.post(
      "/portfolio",
      authMiddleware,
      this.portfolioController.updatePortfolio.bind(this.portfolioController)
    )

    this.addRouter(router)
  }

  public getRouter() {
    return this.router
  }
}

export default PorfolioRouter
