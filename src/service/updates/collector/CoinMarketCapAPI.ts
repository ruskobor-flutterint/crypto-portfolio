import CollectorService from "@services/updates/collector/CollectorService"
import fetch from "node-fetch"
import { Coin, CoinOffering, Price } from "@services/pricing/CoinPricingService"
import { Logger } from "@utils/utils"
import RepeatableService from "./RepeatableService"
import KafkaProducerFactory from "../kafka/KafkaProducerFactory"

class CoinMarketCapAPI implements CollectorService {
  private apiKey: string
  private baseUrl: string
  private logger: Logger
  repeatableService: RepeatableService
  coinPriceUpdatesProducer: KafkaProducerFactory<CoinOffering>

  constructor({
    apiKey,
    baseUrl,
    logger,
    intervalMs,
    coinPriceUpdatesProducer,
  }: {
    apiKey: string
    baseUrl: string
    logger: Logger
    intervalMs: number
    coinPriceUpdatesProducer: KafkaProducerFactory<CoinOffering>
  }) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
    this.logger = logger
    this.coinPriceUpdatesProducer = coinPriceUpdatesProducer
    this.repeatableService = new RepeatableService(
      this.fetchCoins.bind(this),
      intervalMs
    )
    this.repeatableService.start()
  }

  async fetchCoins(): Promise<{ coin: Coin; price: Price }[]> {
    const coinListingPrices = await this.fetch()
    this.logger.info(`Prices fetched : ${JSON.stringify(coinListingPrices)}`)

    if (coinListingPrices) {
      await this.coinPriceUpdatesProducer.sendBatch(coinListingPrices)
    }

    return coinListingPrices ? coinListingPrices : []
  }

  private async fetch() {
    const url = `${this.baseUrl}/v1/cryptocurrency/listings/latest?start=1&limit=50&sort=market_cap&cryptocurrency_type=coins&tag=all`
    const headers = {
      "X-CMC_PRO_API_KEY": this.apiKey,
      Accept: "application/json",
      "Content-Type": "application/json",
    }
    const options = {
      method: "GET",
      headers: headers,
    }

    return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          this.logger.error(
            `Request to ${this.baseUrl} failed with response ${response.status}`
          )
          return null
        }
        return response.json()
      })
      .then((data) => {
        const typedData = data as {
          data: { symbol: string; quote: { USD: { price: number } } }[]
        }
        const mappedData = typedData.data.map((coinData) => {
          return {
            coin: coinData.symbol,
            price: coinData.quote.USD.price,
          }
        })
        return mappedData
      })
      .catch((error) => {
        this.logger.error(`Error fetching data from ${this.baseUrl}:`, error)
        return null
      })
  }
}

export default CoinMarketCapAPI
