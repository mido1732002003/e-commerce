// file: components/products/add-to-cart-button.tsx
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

interface AddToCartButtonProps {
  product: {
    id: number
    title: string
    stock: number
    price_cents: number
    images?: { url: string }[]
  }
  quantity?: number
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function AddToCartButton({ 
  product, 
  quantity = 1, 
  className,
  size = 'default'
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = async () => {
    setLoading(true)
    
    try {
      // Use the context function to add the item
      addItem(product, quantity)
    } catch (error) {
      console.error('Add to cart error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      className={className}
      size={size}
      onClick={handleAddToCart}
      disabled={product.stock === 0 || loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="mr-2 h-4 w-4" />
      )}
      {loading ? 'Adding...' : 'Add to Cart'}
    </Button>
  )
}