import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductGrid } from '@/components/products/product-grid'
import { ProductFilters } from '@/components/products/product-filters'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CategoryPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = params.slug === 'all' ? 'All Products' : params.slug.charAt(0).toUpperCase() + params.slug.slice(1)
  
  return {
    title: `${categoryName} - NextShop`,
    description: `Browse our selection of ${categoryName.toLowerCase()}`,
  }
}

async function getProducts(slug: string, searchParams: any) {
  const url = new URL(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products`)
  
  if (slug !== 'all') {
    url.searchParams.set('category', slug)
  }
  
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, String(value))
    }
  })

  const response = await fetch(url.toString(), {
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  return data.data
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const data = await getProducts(params.slug, searchParams)

  if (!data) {
    notFound()
  }

  const { products, pagination } = data
  const categoryName = params.slug === 'all' ? 'All Products' : params.slug.charAt(0).toUpperCase() + params.slug.slice(1)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>
      
      <ProductFilters />
      <ProductGrid products={products} />
      
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === 1}
            asChild
          >
            <Link
              href={{
                pathname: `/category/${params.slug}`,
                query: { ...searchParams, page: pagination.page - 1 },
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Link>
          </Button>
          
          <span className="text-sm text-muted-foreground px-4">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === pagination.totalPages}
            asChild
          >
            <Link
              href={{
                pathname: `/category/${params.slug}`,
                query: { ...searchParams, page: pagination.page + 1 },
              }}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}