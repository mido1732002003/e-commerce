import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { updateCartItemSchema } from '@/lib/schemas/cart'
import { z } from 'zod'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = parseInt(params.id)
    if (isNaN(itemId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid item ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validated = updateCartItemSchema.parse(body)

    const supabase = createServiceClient()
    
    // Get cart item with product details
    const { data: item, error: itemError } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('id', itemId)
      .single()

    if (itemError || !item) {
      return NextResponse.json(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Check stock
    if (validated.quantity > item.product.stock) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Update quantity
    const { data: updatedItem, error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: validated.quantity })
      .eq('id', itemId)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ success: true, data: updatedItem })
  } catch (error) {
    console.error('Update cart item error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = parseInt(params.id)
    if (isNaN(itemId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid item ID' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()
    
    // Delete the item without checking ownership
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete cart item error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete cart item' },
      { status: 500 }
    )
  }
}