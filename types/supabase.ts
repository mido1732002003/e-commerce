export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          parent_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          parent_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          parent_id?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
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
        }
        Insert: {
          id?: number
          title: string
          slug: string
          description?: string | null
          price_cents: number
          currency?: string
          stock?: number
          category_id?: number | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          slug?: string
          description?: string | null
          price_cents?: number
          currency?: string
          stock?: number
          category_id?: number | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: number
          product_id: number
          url: string
          alt: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: number
          product_id: number
          url: string
          alt?: string | null
          position?: number
          created_at?: string
        }
        Update: {
          id?: number
          product_id?: number
          url?: string
          alt?: string | null
          position?: number
          created_at?: string
        }
      }
      carts: {
        Row: {
          id: string
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: number
          cart_id: string
          product_id: number
          quantity: number
          price_cents_snapshot: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          cart_id: string
          product_id: number
          quantity: number
          price_cents_snapshot: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          cart_id?: string
          product_id?: number
          quantity?: number
          price_cents_snapshot?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
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
          shipping_address: Json
          contact_email: string
          contact_phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id?: string | null
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          payment_method?: 'cod' | 'card' | 'paypal'
          payment_status?: 'unpaid' | 'paid' | 'refunded'
          subtotal_cents: number
          shipping_cents?: number
          tax_cents?: number
          total_cents: number
          currency?: string
          shipping_address: Json
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string | null
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          payment_method?: 'cod' | 'card' | 'paypal'
          payment_status?: 'unpaid' | 'paid' | 'refunded'
          subtotal_cents?: number
          shipping_cents?: number
          tax_cents?: number
          total_cents?: number
          currency?: string
          shipping_address?: Json
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          product_id: number
          quantity: number
          unit_price_cents: number
          total_price_cents: number
          created_at: string
        }
        Insert: {
          id?: number
          order_id: number
          product_id: number
          quantity: number
          unit_price_cents: number
          total_price_cents: number
          created_at?: string
        }
        Update: {
          id?: number
          order_id?: number
          product_id?: number
          quantity?: number
          unit_price_cents?: number
          total_price_cents?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fn_create_order: {
        Args: {
          p_user_id: string
          p_items: Json
          p_shipping_address: Json
          p_contact_email: string
          p_contact_phone?: string
          p_payment_method?: string
        }
        Returns: number
      }
      fn_cancel_order: {
        Args: {
          p_order_id: number
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}