import UserService from "@services/user/UserService"
import User from "./models/User"
import Repository from "@services/persitance/repository/Repository"
import Portfolio from "@services/portfolio/models/Porfolio"
import { Logger } from "@utils/utils"

class UserServiceImpl implements UserService {
  private userRepository: Repository<User>
  private portfolioRepository: Repository<Portfolio>
  private logger: Logger

  constructor({
    userRepository,
    portfolioRepository,
    logger,
  }: {
    userRepository: Repository<User>
    portfolioRepository: Repository<Portfolio>
    logger: Logger
  }) {
    this.userRepository = userRepository
    this.portfolioRepository = portfolioRepository
    this.logger = logger
  }

  async createUser(user: string): Promise<boolean> {
    const userFound = await this.userRepository.find({ user: user })
    if (!userFound) {
      const newUser: User = { user: user }
      await this.userRepository.create(newUser)

      const emptyPortfolio: Portfolio = {
        user: user,
        assets: [],
        lastUpdated: new Date().toISOString(),
      }
      await this.portfolioRepository.create(emptyPortfolio)
      this.logger.info(`Created empty portfolio for user ${user}.`)
    }

    return userFound ? false : true
  }
}

export default UserServiceImpl
