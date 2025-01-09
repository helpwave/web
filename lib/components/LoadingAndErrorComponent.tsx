import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import type { LoadingAnimationProps } from './LoadingAnimation'
import type { ErrorComponentProps } from './ErrorComponent'
import { LoadingAnimation } from './LoadingAnimation'
import { ErrorComponent } from './ErrorComponent'

export type LoadingAndErrorComponentProps = PropsWithChildren<{
  isLoading?: boolean,
  hasError?: boolean,
  loadingProps?: LoadingAnimationProps,
  errorProps?: ErrorComponentProps,
  /**
   * in milliseconds
   */
  minimumLoadingDuration?: number,
}>

/**
 * A Component that shows the Error and Loading animation, when appropriate and the children otherwise
 */
export const LoadingAndErrorComponent = ({
  children,
  isLoading = false,
  hasError = false,
  errorProps,
  loadingProps,
  minimumLoadingDuration
}: LoadingAndErrorComponentProps) => {
  const [isInMinimumLoading, setIsInMinimumLoading] = useState(false)
  const [hasUsedMinimumLoading, setHasUsedMinimumLoading] = useState(false)
  if (minimumLoadingDuration && !isInMinimumLoading && !hasUsedMinimumLoading) {
    setIsInMinimumLoading(true)
    setTimeout(() => {
      setIsInMinimumLoading(false)
      setHasUsedMinimumLoading(true)
    }, minimumLoadingDuration)
  }

  if (isLoading || (minimumLoadingDuration && isInMinimumLoading)) {
    return <LoadingAnimation {...loadingProps}/>
  }
  if (hasError) {
    return <ErrorComponent {...errorProps}/>
  }
  return children
}
