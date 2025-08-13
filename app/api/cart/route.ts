// file: app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('Cart GET: Starting request');
    
    // Always use service client
    const supabase = createServiceClient()
    
    // Get the user from the cookie
    const cookieStore = cookies()
    let userId = cookieStore.get('guest_cart_id')?.value
    
    if (!userId) {
      // No cart yet, return empty cart
      return NextResponse.json({ 
        success: true, 
        data: { 
          id: null,
          items: [] 
        } 
      })
    }
    
    console.log('Using user/guest ID:', userId);
    
    // Get cart
    let { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (cartError) {
      // No cart found
      return NextResponse.json({ 
        success: true, 
        data: { 
          id: null,
          items: [] 
        } 
      })
    }

    // Get cart items with product details
    const { data: items, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('cart_id', cart.id)
      .order('created_at', { ascending: false })

    if (itemsError) {
      throw itemsError
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        id: cart.id,
        items: items || [] 
      } 
    })
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Always use service client
    const supabase = createServiceClient()
    
    // Get the user from the cookie
    const cookieStore = cookies()
    let userId = cookieStore.get('guest_cart_id')?.value
    
    if (!userId) {
      // Nothing to delete
      return NextResponse.json({ success: true })
    }
    
    // Get user's cart
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (cartError) {
      // No cart found
      return NextResponse.json({ success: true })
    }

    // Delete all cart items
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    )
  }
}