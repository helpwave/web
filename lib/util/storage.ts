class StorageSerice {
  // this seems to be a bug in eslint as 'paramter-Properties' is a special syntax of typescript
  // eslint-disable-next-line no-useless-constructor
  constructor(private storage: Storage) {}

  public get<T>(key: string): T | null {
    const value = this.storage.getItem(key)
    if (value === null) {
      return null
    }
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

export class LocalStorageService extends StorageSerice {
  constructor() {
    super(window.localStorage)
  }
}

export class SessionStorageService extends StorageSerice {
  constructor() {
    super(window.sessionStorage)
  }
}
