abstract class Store<T> {
  dbName: string
  client: T
  abstract connect(): Promise<void>
  abstract disconnect(): Promise<void>
}

export default Store
