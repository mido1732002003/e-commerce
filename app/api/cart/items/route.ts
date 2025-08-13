import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { addToCartSchema } from '@/lib/schemas/cart'
import { z } from 'zod'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('Cart API: Starting request');
    
    // Always use service client
    const supabase = createServiceClient()
    
    // Get the user from the cookie or auth
    const cookieStore = cookies()
    let userId = cookieStore.get('guest_cart_id')?.value
    
    if (!userId) {
      // Create a random guest ID
      userId = 'guest-' + Math.random().toString(36).substring(2, 15)
      cookieStore.set('guest_cart_id', userId, { 
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
      })
    }
    
    console.log('Using user/guest ID:', userId);
    
    const body = await request.json()
    const validated = addToCartSchema.parse(body)
    
    // Get or create cart
    let { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (cartError) {
      // Create cart if it doesn't exist
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: userId })
        .select()
        .single()

      if (createError) {
        console.error("Cart creation error:", createError);
        throw createError
      }
      cart = newCart
    }

    console.log('Using cart:', cart.id);

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

    let result;
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

      result = updatedItem;
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

      result = newItem;
    }

    console.log('Operation successful, added/updated item:', result.id);
    return NextResponse.json({ success: true, data: result })
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