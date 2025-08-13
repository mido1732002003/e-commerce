import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/helpers'
import { createOrderSchema, orderQuerySchema } from '@/lib/schemas/order'
import { emailService } from '@/lib/email/service'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createClient()
    const searchParams = request.nextUrl.searchParams
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'

    if (isAdmin) {
      // Admin can query all orders
      const query = orderQuerySchema.parse({
        status: searchParams.get('status'),
        user_id: searchParams.get('user_id'),
        from_date: searchParams.get('from_date'),
        to_date: searchParams.get('to_date'),
        page: searchParams.get('page'),
        pageSize: searchParams.get('pageSize'),
      })

      let queryBuilder = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*, product:products(*))
        `, { count: 'exact' })

      if (query.status) {
        queryBuilder = queryBuilder.eq('status', query.status)
      }
      if (query.user_id) {
        queryBuilder = queryBuilder.eq('user_id', query.user_id)
      }
      if (query.from_date) {
        queryBuilder = queryBuilder.gte('created_at', query.from_date)
      }
      if (query.to_date) {
        queryBuilder = queryBuilder.lte('created_at', query.to_date)
      }

      queryBuilder = queryBuilder.order('created_at', { ascending: false })

      const offset = (query.page - 1) * query.pageSize
      queryBuilder = queryBuilder.range(offset, offset + query.pageSize - 1)

      const { data: orders, error, count } = await queryBuilder

      if (error) {
        throw error
      }

      return NextResponse.json({
        success: true,
        data: {
          orders: orders || [],
          pagination: {
            page: query.page,
            pageSize: query.pageSize,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / query.pageSize),
          },
        },
      })
    } else {
      // Regular users can only see their own orders
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*, product:products(*))
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return NextResponse.json({ success: true, data: orders || [] })
    }
  } catch (error) {
    console.error('Orders GET error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
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

    const body = await request.json()
    const validated = createOrderSchema.parse(body)

    const supabase = createServiceClient()
    
    // Get user's cart items
    const { data: cart } = await supabase
      .from('carts')
      .select(`
        *,
        items:cart_items(*, product:products(*))
      `)
      .eq('user_id', user.id)
      .single()

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Prepare items for order creation
    const orderItems = cart.items.map((item: any) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price_cents: item.product.price_cents,
    }))

    // Call the stored procedure to create order
    const { data: orderId, error } = await supabase.rpc('fn_create_order', {
      p_user_id: user.id,
      p_items: orderItems,
      p_shipping_address: validated.shipping_address,
      p_contact_email: validated.contact_email,
      p_contact_phone: validated.contact_phone || null,
      p_payment_method: validated.payment_method,
    })

    if (error) {
      throw error
    }

    // Clear the cart
    await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)

    // Get the created order for email
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    // Send order confirmation email
    if (order) {
      await emailService.sendOrderConfirmation(order)
    }

    return NextResponse.json({ 
      success: true, 
      data: { id: orderId } 
    })
  } catch (error) {
    console.error('Order POST error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}