import Repository from "./Repository"
import PersitanceStore from "@services/persitance/Store"
import { MongoClient } from "mongodb"
import { Logger } from "@utils/utils"
import User from "@services/user/models/User"

class UserMongoRepository implements Repository<User> {
  private store: PersitanceStore<MongoClient>
  public collectionName: string
  private collection: string
  private logger: Logger

  constructor({
    dbUserCollection,
    userRepositoryLogger,
  }: {
    dbUserCollection: string
    userRepositoryLogger: Logger
  }) {
    this.collectionName = dbUserCollection
    this.logger = userRepositoryLogger
    console.log("UserRepository")
  }
  find(id: string): Promise<string | null> {
    throw new Error("Method not implemented.")
  }
  create(item: string): Promise<string> {
    throw new Error("Method not implemented.")
  }
  update(id: string, item: string): Promise<boolean> {
    throw new Error("Method not implemented.")
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export default UserMongoRepository
