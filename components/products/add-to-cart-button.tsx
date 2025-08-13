"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { ShoppingCart, Loader2 } from 'lucide-react'

interface AddToCartButtonProps {
  product: {
    id: number
    title: string
    stock: number
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
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    setLoading(true)
    
    try {
      console.log('Adding to cart:', product.id);
      
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity }),
      })

      console.log('Response status:', response.status);
      const data = await response.json()
      console.log('Response data:', data);

      if (data.success) {
        toast({
          title: 'Added to cart',
          description: `${product.title} has been added to your cart.`,
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to add item to cart',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
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