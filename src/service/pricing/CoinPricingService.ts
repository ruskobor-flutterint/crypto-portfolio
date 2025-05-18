interface CoinPricingService {
  readonly coinPricing: Map<Coin, Pricing>
  setCoinPrice(coin: Coin, price: Pricing): void
  getCoinPrice(coin: Coin): Pricing | null
}

export default CoinPricingService

type Coin = string
type Pricing = number

export { Coin, Pricing }
