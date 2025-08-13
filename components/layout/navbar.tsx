"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, User, Menu } from 'lucide-react'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">NextShop</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/category/all" className="text-sm font-medium hover:text-primary">
                All Products
              </Link>
              <Link href="/category/electronics" className="text-sm font-medium hover:text-primary">
                Electronics
              </Link>
              <Link href="/category/apparel" className="text-sm font-medium hover:text-primary">
                Apparel
              </Link>
              <Link href="/category/home" className="text-sm font-medium hover:text-primary">
                Home
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
              <Link href="/sign-in">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4">
                  <Link href="/category/all" className="text-sm font-medium hover:text-primary" onClick={() => setOpen(false)}>
                    All Products
                  </Link>
                  <Link href="/category/electronics" className="text-sm font-medium hover:text-primary" onClick={() => setOpen(false)}>
                    Electronics
                  </Link>
                  <Link href="/category/apparel" className="text-sm font-medium hover:text-primary" onClick={() => setOpen(false)}>
                    Apparel
                  </Link>
                  <Link href="/category/home" className="text-sm font-medium hover:text-primary" onClick={() => setOpen(false)}>
                    Home
                  </Link>
                  <hr />
                  <Link href="/cart" className="text-sm font-medium hover:text-primary" onClick={() => setOpen(false)}>
                    Cart
                  </Link>
                  <Link href="/sign-in" className="text-sm font-medium hover:text-primary" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}