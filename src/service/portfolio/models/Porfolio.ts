interface Portfolio {
  user: string
  assets: CryptoAsset[]
  lastUpdated: string | Date
}

type CryptoAsset = { coin: string; amount: number }

const enum Coins {
  "ETH" = "ethereum",
}

export default Portfolio
