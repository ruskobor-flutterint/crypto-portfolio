import { Db, MongoClient } from "mongodb"
import Store from "./Store"
import { Logger } from "@utils/utils"

class MongoStore extends Store<MongoClient> {
  private db: Db
  private logger: Logger

  constructor({
    dbUri,
    dbName,
    dbLogger,
  }: {
    dbUri: string
    dbName: string
    dbLogger: Logger
  }) {
    super()
    this.logger = dbLogger
    this.client = new MongoClient(dbUri)
    this.db = this.client.db(dbName)
    // Connect can be used elsewhere
    this.connect()
  }

  getDb() {
    return this.db
  }

  async connect() {
    try {
      await this.client.connect()
      this.logger.info("Successfully connected to the Db.")
    } catch (error) {
      this.logger.error("Failure to connecto to the Db ", error)
      this.logger.info(
        "Retrying to connect to Db in 3s",
        setTimeout(this.connect, 3000)
      )
    }
  }

  async disconnect() {
    try {
      await this.client.close()
      this.logger.info("Successfully closed Db connection.")
    } catch (error) {
      this.logger.error("Failure to close connection the Db ", error)
    }
  }
}

export default MongoStore
