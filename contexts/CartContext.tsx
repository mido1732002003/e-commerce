"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'

// Types
interface CartItem {
  id?: number
  productId: number
  title: string
  price: number
  quantity: number
  imageUrl?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: any, quantity: number) => void
  updateQuantity: (id: number, quantity: number) => void
  removeItem: (id: number) => void
  clearCart: () => void
  isLoading: boolean
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const { toast } = useToast()

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      setIsAuth(!!data.user)
      setIsLoading(false)
    }
    
    checkAuth()
  }, [])

  // Load cart from localStorage
  useEffect(() => {
    if (!isLoading) {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (e) {
          console.error('Failed to parse cart from localStorage')
          localStorage.removeItem('cart')
        }
      }
    }
  }, [isLoading])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, isLoading])

  // Add item to cart
  const addItem = (product: any, quantity: number) => {
    setItems(prevItems => {
      // Check if product already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.productId === product.id)
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        
        toast({
          title: 'Cart updated',
          description: `Updated quantity of ${product.title} in your cart`,
        })
        
        return updatedItems
      } else {
        // Add new item
        toast({
          title: 'Added to cart',
          description: `${product.title} has been added to your cart`,
        })
        
        return [...prevItems, {
          productId: product.id,
          title: product.title,
          price: product.price_cents,
          quantity,
          imageUrl: product.images?.[0]?.url
        }]
      }
    })
  }

  // Update item quantity
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.productId === productId 
          ? { ...item, quantity } 
          : item
      )
    )
  }

  // Remove item
  const removeItem = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId))
    
    toast({
      title: 'Item removed',
      description: 'Item has been removed from your cart',
    })
  }

  // Clear cart
  const clearCart = () => {
    setItems([])
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from your cart',
    })
  }

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      updateQuantity, 
      removeItem, 
      clearCart,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  )
}

// Hook
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}