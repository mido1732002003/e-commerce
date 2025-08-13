"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { formatCurrency } from '@/lib/utils'
import { ArrowLeft, Loader2 } from 'lucide-react'

interface AdminOrderDetailPageProps {
  params: { id: string }
}

export default function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setOrder(data.data)
      } else {
        throw new Error('Order not found')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load order',
        variant: 'destructive',
      })
      router.push('/admin/orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (status: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: 'Order updated',
          description: 'Order status has been updated successfully.',
        })
        setOrder(data.data)
      } else {
        throw new Error(data.error || 'Failed to update order')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update order',
        variant: 'destructive',
      })
    } finally {
      setUpdating(false)
    }
  }

  const updatePaymentStatus = async (payment_status: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: 'Payment updated',
          description: 'Payment status has been updated successfully.',
        })
        setOrder(data.data)
      } else {
        throw new Error(data.error || 'Failed to update payment')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update payment',
        variant: 'destructive',
      })
    } finally {
      setUpdating(false)
    }
  }

  const cancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order? Stock will be restored.')) return
    
    setUpdating(true)
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: 'Order cancelled',
          description: 'Order has been cancelled and stock restored.',
        })
        router.push('/admin/orders')
      } else {
        throw new Error(data.error || 'Failed to cancel order')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel order',
        variant: 'destructive',
      })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!order) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        </div>
        <Button 
          variant="destructive" 
          onClick={cancelOrder}
          disabled={updating || order.status === 'cancelled'}
        >
          Cancel Order
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded overflow-hidden">
                            <Image
                              src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/50'}
                              alt={item.product?.title || 'Product'}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-medium">{item.product?.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.unit_price_cents)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total_price_cents)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <p className="text-sm">Email: {order.contact_email}</p>
                {order.contact_phone && (
                  <p className="text-sm">Phone: {order.contact_phone}</p>
                )}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Shipping Address</h4>
                <p className="text-sm">{order.shipping_address?.name}</p>
                <p className="text-sm">{order.shipping_address?.address}</p>
                <p className="text-sm">
                  {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zip}
                </p>
                <p className="text-sm">{order.shipping_address?.country}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Order Status</label>
                <Select 
                  value={order.status} 
                  onValueChange={updateOrderStatus}
                  disabled={updating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Payment Status</label>
                <Select 
                  value={order.payment_status} 
                  onValueChange={updatePaymentStatus}
                  disabled={updating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Payment Method: {order.payment_method.toUpperCase()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal_cents)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatCurrency(order.shipping_cents)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(order.tax_cents)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.total_cents)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}