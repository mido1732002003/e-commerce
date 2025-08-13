import { z } from 'zod'

export const shippingAddressSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required').default('USA'),
})

export const createOrderSchema = z.object({
  shipping_address: shippingAddressSchema,
  contact_email: z.string().email('Valid email is required'),
  contact_phone: z.string().optional(),
  payment_method: z.enum(['cod', 'card', 'paypal']).default('cod'),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).optional(),
  payment_status: z.enum(['unpaid', 'paid', 'refunded']).optional(),
})

export const orderQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).optional(),
  user_id: z.string().uuid().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
export type OrderQuery = z.infer<typeof orderQuerySchema>