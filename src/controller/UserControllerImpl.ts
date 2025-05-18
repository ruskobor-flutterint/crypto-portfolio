import UserController from "@controllers/UserController"
import PortfolioService from "@services/portfolio/PortfolioService"
import UserService from "@services/user/UserService"
import { Logger } from "@utils/utils"
import { Request, Response } from "express"

class UserControllerImpl implements UserController {
  userService: UserService
  logger: Logger

  constructor({
    userService,
    logger,
  }: {
    userService: UserService
    portfolioService: PortfolioService
    logger: Logger
  }) {
    this.userService = userService
    this.logger = logger
  }

  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const isUserCreated = await this.userService.createUser("Gesho2")

      isUserCreated
        ? res.status(200).send({ user: "user created" })
        : res.status(200).send({ user: "user not created" })
    } catch (error) {
      this.logger.error("Error in signUp ", error)
      res.status(500).send("Internal Server Error")
    }
  }
}

export default UserControllerImpl
