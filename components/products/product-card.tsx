"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
// FIX: Use AddToCartButton instead of inline implementation
import { AddToCartButton } from '@/components/products/add-to-cart-button'

interface ProductCardProps {
  product: {
    id: number
    title: string
    slug: string
    price_cents: number
    currency: string
    stock: number
    images?: { url: string; alt?: string }[]
    category?: { name: string; slug: string }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/300'
  const imageAlt = product.images?.[0]?.alt || product.title

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy" // FIX: Added lazy loading
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="flex-1 p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>
        {product.category && (
          <Link href={`/category/${product.category.slug}`}>
            <Badge variant="secondary" className="mb-2">
              {product.category.name}
            </Badge>
          </Link>
        )}
        <p className="text-2xl font-bold text-primary">
          {formatCurrency(product.price_cents, product.currency)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {/* FIX: Use AddToCartButton component */}
        <AddToCartButton 
          product={product}
          className="w-full"
        />
      </CardFooter>
    </Card>
  )
}