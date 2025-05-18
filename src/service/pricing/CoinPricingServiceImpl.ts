import { Logger } from "@utils/utils"
import CoinPricingService, { Coin, Pricing } from "./CoinPricingService"

class CoinPricingServiceImpl implements CoinPricingService {
  readonly coinPricing: Map<Coin, Pricing>
  private logger: Logger

  constructor({
    coinPricingServiceLogger,
  }: {
    coinPricingServiceLogger: Logger
  }) {
    this.logger = coinPricingServiceLogger
  }

  setCoinPrice(coin: Coin, price: Pricing): void {
    this.logger.info(`New pricing set ${coin}:${price}`)
    this.coinPricing.set(coin, price)
  }

  getCoinPrice(coin: Coin): Pricing | null {
    const price = this.coinPricing.get(coin)
    return price && !Number.isNaN(price) ? price : null
  }
}

export default CoinPricingServiceImpl
