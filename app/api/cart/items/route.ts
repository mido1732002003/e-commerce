import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/helpers'
import { addToCartSchema } from '@/lib/schemas/cart'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = addToCartSchema.parse(body)

    const supabase = createClient()
    
    // Get or create cart
    let { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (cartError && cartError.code === 'PGRST116') {
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

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', validated.productId)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    if (!product.active || product.stock < validated.quantity) {
      return NextResponse.json(
        { success: false, error: 'Product not available in requested quantity' },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .eq('product_id', validated.productId)
      .single()

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + validated.quantity
      if (newQuantity > product.stock) {
        return NextResponse.json(
          { success: false, error: 'Insufficient stock' },
          { status: 400 }
        )
      }

      const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        .update({ 
          quantity: newQuantity,
          price_cents_snapshot: product.price_cents
        })
        .eq('id', existingItem.id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      return NextResponse.json({ success: true, data: updatedItem })
    } else {
      // Add new item
      const { data: newItem, error: insertError } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: validated.productId,
          quantity: validated.quantity,
          price_cents_snapshot: product.price_cents
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      return NextResponse.json({ success: true, data: newItem })
    }
  } catch (error) {
    console.error('Add to cart error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}