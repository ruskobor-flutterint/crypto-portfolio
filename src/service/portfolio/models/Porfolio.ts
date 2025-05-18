interface Portfolio {
  user: string
  assets: CryptoAsset[]
  lastUpdated: string | Date
}

type CryptoAsset = { coin: string; amount: number }

export default Portfolio
