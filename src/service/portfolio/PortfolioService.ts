import User from "@services/user/models/User"
import Portfolio, { UsdEvaluatedPortfolio } from "./models/Porfolio"

interface PortfolioService {
  updatePortfolio(user: User, portfolio: Portfolio): Promise<boolean>
  getPortfolio(user: User): Promise<UsdEvaluatedPortfolio | null>
  producePortfolioUpdate(): Promise<void>
}

export default PortfolioService
