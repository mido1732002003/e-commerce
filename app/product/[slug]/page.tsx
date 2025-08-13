import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { ShoppingCart, Package, Truck } from 'lucide-react'
import Link from 'next/link'
// FIX: Added AddToCartButton component import
import { AddToCartButton } from '@/components/products/add-to-cart-button'

interface ProductPageProps {
  params: { slug: string }
}

async function getProduct(slug: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products?q=${slug}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  const products = data.data?.products || []
  
  return products.find((p: any) => p.slug === slug)
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug)
  
  if (!product) {
    return {
      title: 'Product Not Found - NextShop',
    }
  }

  return {
    title: `${product.title} - NextShop`,
    description: product.description || `Buy ${product.title} at NextShop`,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const mainImage = product.images?.[0] || { url: 'https://via.placeholder.com/600', alt: product.title }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={mainImage.url}
              alt={mainImage.alt || product.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image: any, index: number) => (
                <div key={index} className="aspect-square relative overflow-hidden rounded-md">
                  <Image
                    src={image.url}
                    alt={image.alt || `${product.title} ${index + 1}`}
                    fill
                    className="object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    sizes="(max-width: 1024px) 25vw, 12.5vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            {product.category && (
              <Link href={`/category/${product.category.slug}`}>
                <Badge variant="secondary" className="mb-4">
                  {product.category.name}
                </Badge>
              </Link>
            )}
          </div>

          <div className="text-3xl font-bold text-primary">
            {formatCurrency(product.price_cents, product.currency)}
          </div>

          {product.description && (
            <div className="prose prose-sm max-w-none">
              <p>{product.description}</p>
            </div>
          )}

          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                {product.stock > 0 ? (
                  <span className="text-green-600">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Free shipping on orders over $50</span>
            </div>
          </Card>

          <div className="flex gap-4">
            {/* FIX: Replaced static Button with AddToCartButton component */}
            <AddToCartButton 
              product={product}
              className="flex-1"
              size="lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}