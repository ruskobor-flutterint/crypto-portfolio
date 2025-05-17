import Portfolio from "@services/portfolio/models/Porfolio"
import Repository from "./Repository"
import { Logger } from "@utils/utils"
import Store from "../Store"
import { Collection, Filter, MongoClient, WithId, WithoutId } from "mongodb"
import MongoStore from "../MongoStore"

class PortfolioMongoRepository implements Repository<Portfolio> {
  public collectionName: string
  private logger: Logger
  private store: MongoStore
  private collection: Collection<Portfolio>

  constructor({
    dbService,
    dbPortfolioCollection,
    portfolioRepositoryLogger,
  }: {
    dbService: Store<MongoClient>
    dbPortfolioCollection: string
    portfolioRepositoryLogger: Logger
  }) {
    this.store = dbService as MongoStore
    this.logger = portfolioRepositoryLogger
    this.collectionName = dbPortfolioCollection
    this.collection = this.store.getDb().collection(this.collectionName)
  }

  async find(query: WithoutId<Portfolio>): Promise<Portfolio | null> {
    try {
      const portfolio = await this.collection.findOne(query)
      if (portfolio)
        this.logger.info(
          `Successfully found ${query.user} portfolio:`,
          portfolio
        )
      return portfolio ? portfolio : null
    } catch (error) {
      this.logger.error(`Error finding ${query.user} portfolio:`, error)
      return null
    }
  }

  async update(
    query: Filter<Portfolio>,
    update: WithoutId<Portfolio>
  ): Promise<boolean> {
    try {
      const result = await this.collection.findOneAndReplace(query, update)
      if (result)
        this.logger.info(`Sucessfully updated ${query.user} portfolio `, update)
      return result ? true : false
    } catch (error) {
      this.logger.error(`Portfolio ${query} update ${update} failed, `, error)
      return false
    }
  }

  //
  async create(item: Portfolio): Promise<Portfolio> {
    throw new Error("Method not implemented.")
  }

  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export default PortfolioMongoRepository
