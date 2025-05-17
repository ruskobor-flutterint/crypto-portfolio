import { Request, Response } from "express"

interface PortfolioController {
  getPortfolio: (req: Request, res: Response) => Promise<void>
  updatePortfolio: (req: Request, res: Response) => Promise<void>
}

export default PortfolioController
