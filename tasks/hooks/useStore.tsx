import type { Dispatch, FunctionComponent, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useState } from 'react'

export type StoreState = {
  time: string
}

type Store = {
  setState: Dispatch<SetStateAction<StoreState>>,
  state: StoreState
}

const initialStoreState: StoreState = {
  time: Date.now().toString()
}

const StoreContext = createContext<Store>({
  state: initialStoreState, setState: () => undefined,
})

export const useStore = () => useContext(StoreContext)

export const ProvideStore: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<StoreState>(initialStoreState)

  return (
    <StoreContext.Provider value={{
      state,
      setState,
    }}>
      {children}
    </StoreContext.Provider>
  )
}
