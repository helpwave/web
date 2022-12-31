import { useEffect } from 'react'
import type { RefObject } from 'react'

export const useOutsideClick = <Ts extends RefObject<HTMLElement>[]>(refs: Ts, handler: () => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // returning means not "not clicking outside"

      // if no target exists, return
      if (event.target === null) return
      // if the target is a ref's element or descendent thereof, return
      if (refs.some((ref) => !ref.current || ref.current.contains(event.target as Node))) {
        return
      }

      handler()
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [refs, handler])
}
