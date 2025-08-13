"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { Trash2, Plus, Minus } from 'lucide-react'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (itemId: number, quantity: number) => void
  onRemove: (itemId: number) => void
  updating: boolean
}

export function CartItem({ item, onUpdateQuantity, onRemove, updating }: CartItemProps) {
  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <div className="relative w-24 h-24 rounded-md overflow-hidden">
        <Image
          src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/100'}
          alt={item.product?.title || 'Product'}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex-1">
        <Link href={`/product/${item.product?.slug}`}>
          <h3 className="font-semibold hover:text-primary transition-colors">
            {item.product?.title}
          </h3>
        </Link>
        <p className="text-lg font-bold text-primary mt-1">
          {formatCurrency(item.price_cents_snapshot)}
        </p>
        
        <div className="flex items-center gap-2 mt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={updating || item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
            className="w-16 text-center"
            min="1"
            disabled={updating}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={updating}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onRemove(item.id)}
            disabled={updating}
            className="ml-auto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}