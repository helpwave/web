import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

type UseHoverStateProps = {
  /**
   * The delay after which the menu is closed in milliseconds
   *
   * default: 200ms
   */
  closingDelay: number,
  /**
   * Whether the hover state management should be disabled
   *
   * default: false
   */
  isDisabled: boolean,
}

type UseHoverStateReturnType = {
  /**
   * Whether the element is hovered
   */
  isHovered: boolean,
  /**
   * Function to change the current hover status
   */
  setIsHovered: Dispatch<SetStateAction<boolean>>,
  /**
   * Handlers to pass on to the component that should be hovered
   */
  handlers: {
    onMouseEnter: () => void,
    onMouseLeave: () => void,
  },
}

const defaultUseHoverStateProps: UseHoverStateProps = {
  closingDelay: 200,
  isDisabled: false,
}

/**
 * @param props See UseHoverStateProps
 *
 * A react hook for managing the hover state of a component. The handlers provided should be
 * forwarded to the component which should be hovered over
 */
export const useHoverState = (props: Partial<UseHoverStateProps> | undefined = undefined): UseHoverStateReturnType => {
  const { closingDelay, isDisabled } = { ...defaultUseHoverStateProps, ...props }

  const [isHovered, setIsHovered] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout>()

  const onMouseEnter = () => {
    if (isDisabled) {
      return
    }
    clearTimeout(timer)
    setIsHovered(true)
  }

  const onMouseLeave = () => {
    if (isDisabled) {
      return
    }
    setTimer(setTimeout(() => {
      setIsHovered(false)
    }, closingDelay))
  }

  useEffect(() => {
    if (timer) {
      return () => {
        clearTimeout(timer)
      }
    }
  })

  useEffect(() => {
    if (timer) {
      clearTimeout(timer)
    }
  }, [isDisabled]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isHovered, setIsHovered, handlers: { onMouseEnter, onMouseLeave }
  }
}
