import PriceCollectorService from "@services/updates/PriceCollectorService"
import { CollectorService } from "./collector/ICollectorService"
import { Logger } from "@utils/utils"
import ICollectorService from "./collector/ICollectorService"

class PriceCollectorServiceImpl implements PriceCollectorService {
  logger: Logger
  collectorService: ICollectorService
  readonly fetchTimeoutMs: number

  constructor(service: CollectorService, logger: Logger) {
    this.collectorService = new service()
    this.logger = logger
  }

  fetchLatestPrices(): Promise<void> {
    // this.collectorService
    throw new Error("Method not implemented.")
  }
}

export default PriceCollectorServiceImpl
