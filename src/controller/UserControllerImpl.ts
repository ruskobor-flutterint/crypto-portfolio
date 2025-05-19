import UserController from "@controllers/UserController"
import PortfolioService from "@services/portfolio/PortfolioService"
import CollectorService from "@services/updates/collector/CollectorService"
import User from "@services/user/models/User"
import UserService from "@services/user/UserService"
import { Logger } from "@utils/utils"
import { Request, Response } from "express"

class UserControllerImpl implements UserController {
  userService: UserService
  logger: Logger
  collectorService: CollectorService

  constructor({
    userService,
    logger,
    collectorService,
  }: {
    userService: UserService
    portfolioService: PortfolioService
    logger: Logger
    collectorService: CollectorService
  }) {
    this.userService = userService
    this.logger = logger
    this.collectorService = collectorService
  }

  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const user = req.body as User
      const isUserCreated = await this.userService.createUser(user.user)

      //
      // this.logger.info("experiment with repeatable service")
      // await this.collectorService.fetchCoins()
      // this.logger.info("finished")
      //
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
