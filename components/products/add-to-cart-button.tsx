"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setIsAuthenticated(!!user)
  }

  const handleAddToCart = async () => {
    // FIX: Check authentication before adding to cart
    if (!isAuthenticated) {
      // Store intended action in localStorage for after sign-in
      localStorage.setItem('pendingCartAdd', JSON.stringify({ 
        productId: product.id, 
        quantity 
      }))
      
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add items to your cart',
      })
      
      router.push('/auth/sign-in?redirect=/product/' + product.id)
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity }),
      })

      const data = await response.json()

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