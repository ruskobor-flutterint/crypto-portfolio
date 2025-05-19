interface Portfolio {
  user: string
  assets: CryptoAsset[]
  lastUpdated: string | Date
}

type CryptoAsset = { coin: string; amount: number }

type UsdEvaluatedPortfolio = {
  portfolio: Portfolio
  evaluation: {
    assets: { coin: string; amountInUsd: number }[]
    totalUsd: number
    evaluatedTs: string
  }
}

export { CryptoAsset, UsdEvaluatedPortfolio }
export default Portfolio
