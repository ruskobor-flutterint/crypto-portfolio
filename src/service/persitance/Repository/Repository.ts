interface Repository<T> {
  collectionName: string
  find(query: Partial<T>): Promise<T | null>
  create(item: T): Promise<boolean>
  update(query: { [K in keyof T]?: T[K] }, item: Partial<T>): Promise<boolean>
  delete(id: string): Promise<void>
}

export default Repository
