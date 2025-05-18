import ICollectorService from "@services/updates/collector/ICollectorService"
import { Logger } from "@utils/utils"

interface PriceCollectorService {
  collectorService: ICollectorService
  logger: Logger
}

export default PriceCollectorService
