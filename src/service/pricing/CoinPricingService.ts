interface CoinPricingService {
  readonly coinPricing: Map<Coin, Price>
  setCoinPrice(coin: Coin, price: Price): void
  getCoinPrice(coin: Coin): Price | null
}

export default CoinPricingService

type Coin = string
type Price = number

interface CoinOffering {
  coin: Coin
  price: Price
}

export { Coin, Price, CoinOffering }
