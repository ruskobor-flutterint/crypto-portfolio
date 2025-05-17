import ICollectorService from "@services/updates/collector/ICollectorService"
import { Logger } from "@utils/utils"

interface IPriceCollectorService {
  collectorService: ICollectorService
  logger: Logger
}

export default IPriceCollectorService
