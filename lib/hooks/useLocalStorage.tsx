import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Dispatch, FunctionComponent, PropsWithChildren, SetStateAction } from 'react'
import { LocalStorageService } from "../util/storage"

type SetValue<T> = Dispatch<SetStateAction<T>>
type FunctionType = <T>(key: string, initValue: T) => [T, SetValue<T>]

const useLocalStorage: FunctionType = <T, >(key: string, initValue: T) => {
  const get = useCallback((): T => {
    if (typeof window === 'undefined') { 
      return initValue
    }
    const storageService = new LocalStorageService()
    const value = storageService.get<T>(key)
    return value || initValue
  }, [initValue, key])

  const [storedValue, setStoredValue] = useState<T>(get)

  const setValue: SetValue<T> = useCallback(value => {
    const newValue = value instanceof Function ? value(storedValue) : value
    const storageService = new LocalStorageService()
    storageService.set(key, value)

    setStoredValue(newValue)
  }, [storedValue, setStoredValue, key])

  useEffect(() => {
    setStoredValue(get())
  }, [])

  return [storedValue, setValue]
}

export default useLocalStorage