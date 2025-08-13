import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/helpers'
import { createProductSchema, productQuerySchema } from '@/lib/schemas/product'
import { getCached, setCached, cacheKey, invalidateProductCache } from '@/lib/cache/redis'
import { z } from 'zod'

// file: app/api/products/route.ts (partial - just the GET function)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = productQuerySchema.parse({
      q: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      sort: searchParams.get('sort') || undefined,
      page: searchParams.get('page') || undefined,
      pageSize: searchParams.get('pageSize') || undefined,
    })


    // Check cache
    const cacheKeyStr = cacheKey('products', query)
    const cached = await getCached(cacheKeyStr)
    if (cached) {
      return NextResponse.json({ success: true, data: cached })
    }

    const supabase = createClient()
    
    let queryBuilder = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*)
      `, { count: 'exact' })
      .eq('active', true)

    // Apply filters
    if (query.q) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query.q}%,description.ilike.%${query.q}%`)
    }

    if (query.category) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', query.category)
        .single()
      
      if (category) {
        queryBuilder = queryBuilder.eq('category_id', category.id)
      }
    }

    // Apply sorting
    switch (query.sort) {
      case 'price_asc':
        queryBuilder = queryBuilder.order('price_cents', { ascending: true })
        break
      case 'price_desc':
        queryBuilder = queryBuilder.order('price_cents', { ascending: false })
        break
      case 'name_asc':
        queryBuilder = queryBuilder.order('title', { ascending: true })
        break
      case 'name_desc':
        queryBuilder = queryBuilder.order('title', { ascending: false })
        break
      default:
        queryBuilder = queryBuilder.order('created_at', { ascending: false })
    }

    // Apply pagination
    const offset = (query.page - 1) * query.pageSize
    queryBuilder = queryBuilder.range(offset, offset + query.pageSize - 1)

    const { data: products, error, count } = await queryBuilder

    if (error) {
      throw error
    }

    const result = {
      products: products || [],
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / query.pageSize),
      },
    }

    // Cache the result
    await setCached(cacheKeyStr, result)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Products GET error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validated = createProductSchema.parse(body)
    
    const { images, ...productData } = validated

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (productError) {
      throw productError
    }

    // Insert images if provided
    if (images && images.length > 0) {
      const imageData = images.map(img => ({
        product_id: product.id,
        url: img.url,
        alt: img.alt,
        position: img.position,
      }))

      const { error: imageError } = await supabase
        .from('product_images')
        .insert(imageData)

      if (imageError) {
        console.error('Image insert error:', imageError)
      }
    }

    // Invalidate cache
    await invalidateProductCache()

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('Product POST error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}