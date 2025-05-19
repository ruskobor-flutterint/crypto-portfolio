import { Coin, Price } from "@services/pricing/CoinPricingService"
import RepeatableService from "./RepeatableService"

interface CollectorService {
  fetchCoins(): Promise<{ coin: Coin; price: Price }[]>
  repeatableService: RepeatableService
}

export default CollectorService
