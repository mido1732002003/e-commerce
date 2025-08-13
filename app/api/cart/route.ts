import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/helpers'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ success: true, data: { items: [] } })
    }

    const supabase = createClient()
    
    // Get or create cart
    let { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (cartError && cartError.code === 'PGRST116') {
      // Create cart if it doesn't exist
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: user.id })
        .select()
        .single()

      if (createError) {
        throw createError
      }
      cart = newCart
    } else if (cartError) {
      throw cartError
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
    const user = await getUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createClient()
    
    // Get user's cart
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (cartError) {
      if (cartError.code === 'PGRST116') {
        return NextResponse.json({ success: true })
      }
      throw cartError
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