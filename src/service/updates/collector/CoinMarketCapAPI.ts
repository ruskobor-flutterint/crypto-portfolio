import ICollectorService from "@services/updates/collector/ICollectorService"
import fetch from "node-fetch"

class CoinMarketCapAPI implements ICollectorService {
  constructor(private apiKey: string, private baseUrl: string) {}

  getMappedCoinResource(): Promise<void> {
    throw new Error("Method not implemented.")
  }

  getPrice(coin: string): Promise<void> {
    throw new Error("Method not implemented.")
  }

  async getPrices(): Promise<void> {
    const listingPrices = await this.fetch()
  }

  getInbulkprice(coin: string): Promise<void> {
    throw new Error("Method not implemented.")
  }

  private async fetch() {
    const url = `${this.baseUrl}/v1/cryptocurrency/listings/latest?start=1&limit=100&sort=market_cap&cryptocurrency_type=coins&tag=all`

    const headers = {
      "X-CMC_PRO_API_KEY": this.apiKey,
      Accept: "application/json",
      "Content-Type": "application/json",
    }

    const options = {
      method: "GET",
      headers: headers,
    }

    //
    return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
      })
  }
}

export default CoinMarketCapAPI
