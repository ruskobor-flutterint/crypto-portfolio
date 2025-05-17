import IPriceCollectorService from "@services/updates/IPriceCollectorService"
import { CollectorService } from "./collector/ICollectorService"
import { Logger } from "@utils/utils"
import ICollectorService from "./collector/ICollectorService"

class PriceCollectorService implements IPriceCollectorService {
  logger: Logger
  collectorService: ICollectorService

  constructor(service: CollectorService, logger: Logger) {
    this.collectorService = new service()
    this.logger = logger
  }
}

export default PriceCollectorService
