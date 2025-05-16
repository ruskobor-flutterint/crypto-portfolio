import { Router } from "express"
import BaseRouter from "./BaseRouter"
import PortfolioController from "@controllers/IPortfolioController"

class PorfolioRouter extends BaseRouter {
  private portfolioController: PortfolioController

  constructor() {
    super()

    const router = Router()

    router.get("/portfolio", this.portfolioController.getPortfolio)
    router.post("/portfolio", this.portfolioController.updatePortfolio)

    this.addRouter(router)
  }

  public getRouter() {
    return this.router
  }
}

export default PorfolioRouter
