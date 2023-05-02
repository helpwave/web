class StorageSerice {
  constructor(private storage: Storage) {}

  public get<T>(key: string): T | null{
    let value = this.storage.getItem(key)
    if (value === null)
      return null
    return JSON.parse(value)
  }

  public set<T>(key: string, value: T) {
    this.storage.setItem(key, JSON.stringify(value))
  }

  public delete(key: string) {
    this.storage.removeItem(key)
  }

  public deleteAll() {
    this.storage.clear()
  }
}

export default new StorageSerice(window.localStorage);