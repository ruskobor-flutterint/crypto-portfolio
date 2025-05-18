import PersitanceStore from "@services/persitance/Store"
import { Collection, MongoClient } from "mongodb"
import { Logger } from "@utils/utils"
import User from "@services/user/models/User"
import Repository from "@services/persitance/repository/Repository"
import MongoStore from "../MongoStore"

class UserMongoRepository implements Repository<User> {
  private logger: Logger
  public collectionName: string
  private collection: Collection<User>
  private store: MongoStore

  constructor({
    dbUserCollection,
    dbService,
    logger,
  }: {
    dbUserCollection: string
    dbService: PersitanceStore<MongoClient>
    logger: Logger
  }) {
    this.store = dbService as MongoStore
    this.collectionName = dbUserCollection
    this.logger = logger
    this.collection = this.store.getDb().collection(this.collectionName)
  }

  async find(query: Partial<User>): Promise<User | null> {
    try {
      const user = await this.collection.findOne(query, {
        projection: { _id: 0 },
      })
      if (user) this.logger.info(`User was found ${query.user}.`)
      return user ? user : null
    } catch (error) {
      this.logger.error(`Failure finding ${query.user} `, error)
      return null
    }
  }

  async create(item: User): Promise<boolean> {
    try {
      const user = await this.collection.insertOne(item)
      if (user.acknowledged)
        this.logger.info(`User ${item.user} has been created.`)
      return user.acknowledged
    } catch (error) {
      this.logger.error(`User ${item.user} failed to create `, error)
      return false
    }
  }

  update(
    query: { user?: string | undefined },
    item: Partial<User>
  ): Promise<boolean> {
    throw new Error("Method not implemented.")
  }

  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export default UserMongoRepository
