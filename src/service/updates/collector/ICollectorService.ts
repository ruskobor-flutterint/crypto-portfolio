interface ICollectorService {
  getMappedCoinResource(): Promise<void>
  getPrice(coin?: string): Promise<void>
}

export default ICollectorService
export type CollectorService = new () => ICollectorService
