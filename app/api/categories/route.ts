import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/helpers'
import { createCategorySchema } from '@/lib/schemas/category'
import { getCached, setCached, invalidateCategoryCache } from '@/lib/cache/redis'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    // Check cache
    const cacheKey = 'categories:all'
    const cached = await getCached(cacheKey)
    if (cached) {
      return NextResponse.json({ success: true, data: cached })
    }

    const supabase = createClient()
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    // Cache the result
    await setCached(cacheKey, categories)

    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error('Categories GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
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
    const validated = createCategorySchema.parse(body)

    const { data: category, error } = await supabase
      .from('categories')
      .insert(validated)
      .select()
      .single()

    if (error) {
      throw error
    }

    // Invalidate cache
    await invalidateCategoryCache()

    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    console.error('Category POST error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}