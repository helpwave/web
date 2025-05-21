import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { noop } from '@helpwave/hightide'
import type { ProductPlanType } from '@/api/dataclasses/product'
import type { Voucher } from '@/api/dataclasses/voucher'

export type CartItem = {
  id: string,
  quantity: number,
  voucher?: Voucher,
  plan: {
    uuid: string,
    type: ProductPlanType,
  },
}

export type CartContextType = {
  isLoading: boolean,
  cart: CartItem[],
  addItem: (item: CartItem) => void,
  updateItem: (item: CartItem) => void,
  removeItem: (id: string) => void,
  clearCart: () => void,
}

const CartContext = createContext<CartContextType>({
  isLoading: true,
  cart: [],
  addItem: noop,
  clearCart: noop,
  removeItem: noop,
  updateItem: noop,
})


export const CartProvider = ({ children }: PropsWithChildren) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setCart(JSON.parse(savedCart) as CartItem[])
      }
    } catch {
      console.error('Could not load cart from storage and cleared it')
      setCart([])
    }
    setIsLoading(false)
  }, [])

  // Save cart to localStorage on update
  useEffect(() => {
    if(!isLoading) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart]) // eslint-disable-line react-hooks/exhaustive-deps

  // Add item to cart
  const addItem = (product: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  // Remove item from cart
  const removeItem = (id: string) => {
    setCart((prevState) => prevState.filter((item) => item.id !== id))
  }

  // Update
  const updateItem = (update: CartItem) => {
    setCart(prevState => prevState.map((item) => (item.id ===  update.id? update : item)))
  }

  // Clear cart
  const clearCart = () => setCart(() => [])

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateItem, clearCart, isLoading }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
