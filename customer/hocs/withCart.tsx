import type { ComponentType } from 'react'
import { CartProvider } from '@/hooks/useCart'

export function withCart<T extends object>(Component: ComponentType<T>) {
  const WrappedComponent = (props: T) => (
    <CartProvider>
      <Component {...props} />
    </CartProvider>
  )
  WrappedComponent.displayName = `withCart(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}
