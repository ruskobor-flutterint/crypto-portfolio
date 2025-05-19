import Portfolio from "@services/portfolio/models/Porfolio"
import Repository from "@services/persitance/repository/Repository"
import { Logger } from "@utils/utils"
import Store from "@services/persitance/Store"
import MongoStore from "@services/persitance/MongoStore"
import { Collection, Filter, MongoClient, WithoutId } from "mongodb"

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

  async find(
    query: WithoutId<Portfolio>
  ): Promise<WithoutId<Portfolio> | null> {
    try {
      const portfolio = await this.collection.findOne(query, {
        projection: { _id: 0 },
      })
      if (portfolio)
        this.logger.info(
          `Successfully found ${query.user}'s portfolio: ${JSON.stringify(
            portfolio
          )}`
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
      const result = await this.collection.findOneAndUpdate(query, {
        $set: { assets: update.assets },
      })
      if (result)
        this.logger.info(`Sucessfully updated ${query.user} portfolio `, update)
      return result ? true : false
    } catch (error) {
      this.logger.error(
        `Portfolio ${JSON.stringify(query)} update ${JSON.stringify(
          update
        )} failed, `,
        error
      )
      return false
    }
  }

  async create(item: Portfolio): Promise<boolean> {
    try {
      const portfolio = await this.collection.insertOne(item)
      if (portfolio.acknowledged)
        this.logger.info(`Portfolio ${JSON.stringify(item)} has been created.`)
      return portfolio.acknowledged
    } catch (error) {
      this.logger.error(
        `Portfolio ${JSON.stringify(item)} failed to create `,
        error
      )
      return false
    }
  }

  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export default PortfolioMongoRepository
