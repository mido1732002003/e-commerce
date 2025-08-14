import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit/middleware'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

const protectedRoutes = [
  '/cart',
  '/checkout',
  '/orders',
  '/admin'
]

const protectedApiRoutes = [
  '/api/cart',
  '/api/orders'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const supabase = createClient(cookies())
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.redirect(
        new URL(`/sign-in?redirect=${pathname}`, request.url)
      )
    }
  }
  
  // Check protected API routes
  if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
    const supabase = createClient(cookies())
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }
  
  // Apply rate limiting to API routes
  if (pathname.startsWith('/api')) {
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'anonymous'
    const rateLimitResult = await checkRateLimit(ip)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many requests. Please try again later.' 
        },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      )
    }
    
    // Add rate limit headers to successful responses
    const response = NextResponse.next()
    const headers = getRateLimitHeaders(rateLimitResult)
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}