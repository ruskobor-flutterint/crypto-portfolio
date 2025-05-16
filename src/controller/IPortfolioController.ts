import { Request, Response } from "express"

interface IPortfolioController {
  getPortfolio: (req: Request, res: Response) => Promise<void>
  updatePortfolio: (req: Request, res: Response) => Promise<void>
}

export default IPortfolioController
