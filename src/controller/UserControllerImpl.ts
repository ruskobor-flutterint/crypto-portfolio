import UserController from "@controllers/UserController"
import PortflioService from "@services/portfolio/PortfolioService"
import { Request, Response } from "express"

class UserControllerImpl implements UserController {
  portfolioService: PortflioService

  constructor() {
    console.log("UserControllerImpl")
  }

  async signIn(req: Request, res: Response): Promise<void> {
    console.log("SignIn")
  }
}

export default UserControllerImpl
