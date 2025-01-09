import type { PropsWithChildren } from 'react'
import { createContext, useState } from 'react'
import { noop } from '../../util/noop'

export type ModalContextType = {
  register: string[],
  addToRegister: (id: string) => void,
  removeFromRegister: (id: string) => void,
}
export const ModalContext = createContext<ModalContextType>({
  register: [],
  addToRegister: noop,
  removeFromRegister: noop,
})

/**
 * A Simple Wrapper for the context
 */
export const ModalRegister = ({
  children
}: PropsWithChildren) => {
  const [register, setRegister] = useState<string[]>([])

  const inRegister = (id: string) => {
    return !!register.find(value => value === id)
  }

  const addToRegister = (id: string) => {
    if (!inRegister(id)) {
      setRegister([...register, id])
    }
  }

  const removeFromRegister = (id: string) => {
    if (inRegister(id)) {
      setRegister(register.filter(value => value !== id))
    }
  }

  return (
    <ModalContext.Provider value={{ register, addToRegister, removeFromRegister }}>
      {children}
    </ModalContext.Provider>
  )
}
