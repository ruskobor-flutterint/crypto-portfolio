import User from "@services/user/models/User"
import Portfolio from "./models/Porfolio"

interface PortfolioService {
  updatePortfolio(user: User, portfolio: Portfolio): Promise<boolean>
  getPortfolio(user: User): Promise<Portfolio | null>
}

export default PortfolioService
