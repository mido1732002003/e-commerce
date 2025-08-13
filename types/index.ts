
export interface Product {
  id: number
  title: string
  slug: string
  description: string | null
  price_cents: number
  currency: string
  stock: number
  category_id: number | null
  active: boolean
  created_at: string
  updated_at: string
  category?: Category
  images?: ProductImage[]
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  parent_id: number | null
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: number
  product_id: number
  url: string
  alt: string | null
  position: number
  created_at: string
}

export interface Cart {
  id: string
  user_id: string | null
  created_at: string
  updated_at: string
  items: CartItem[]
}

export interface CartItem {
  id: number
  cart_id: string
  product_id: number
  quantity: number
  price_cents_snapshot: number
  created_at: string
  updated_at: string
  product?: Product
}

export interface Order {
  id: number
  user_id: string | null
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  payment_method: 'cod' | 'card' | 'paypal'
  payment_status: 'unpaid' | 'paid' | 'refunded'
  subtotal_cents: number
  shipping_cents: number
  tax_cents: number
  total_cents: number
  currency: string
  shipping_address: ShippingAddress
  contact_email: string
  contact_phone: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  unit_price_cents: number
  total_price_cents: number
  created_at: string
  product?: Product
}

export interface ShippingAddress {
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

export interface User {
  id: string
  email: string
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}