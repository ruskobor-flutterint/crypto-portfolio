import { Logger } from "@utils/utils"
import CoinPricingService, {
  Coin,
  CoinOffering,
  Price,
} from "./CoinPricingService"
import KakfaConsumerFactory from "@services/updates/kafka/KafkaConsumerFactory"

class CoinPricingServiceImpl implements CoinPricingService {
  readonly coinPricing: Map<Coin, Price>
  private logger: Logger
  private coinPriceUpdatesConsumer: KakfaConsumerFactory<CoinOffering>

  constructor({
    logger,
    coinPriceUpdatesConsumer,
  }: {
    logger: Logger
    coinPriceUpdatesConsumer: KakfaConsumerFactory<CoinOffering>
  }) {
    this.logger = logger
    this.coinPriceUpdatesConsumer = coinPriceUpdatesConsumer
    this.coinPricing = new Map<Coin, Price>()
    this.coinPriceUpdatesConsumer.start(this.handlePriceUpdate.bind(this))
  }

  async handlePriceUpdate(message: CoinOffering) {
    this.setCoinPrice(message.coin, message.price)
  }

  setCoinPrice(coin: Coin, price: Price): void {
    this.coinPricing.set(coin, price)
    this.logger.info(`New coin pricing set ${coin}:${price}`)
  }

  getCoinPrice(coin: Coin): Price | null {
    const price = this.coinPricing.get(coin)
    return price && !Number.isNaN(price) ? price : null
  }
}

export default CoinPricingServiceImpl
