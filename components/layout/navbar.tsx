"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, User, Menu, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useCart } from '@/contexts/CartContext'
import { Badge } from '@/components/ui/badge'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { items } = useCart()

  const cartItemCount = items.reduce((count, item) => count + item.quantity, 0)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      setIsAuthenticated(true)
      
      // Check if admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        
      setIsAdmin(profile?.role === 'admin')
    } else {
      setIsAuthenticated(false)
      setIsAdmin(false)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign out',
        variant: 'destructive',
      })
      return
    }
    
    setIsAuthenticated(false)
    setIsAdmin(false)
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully',
    })
    
    // Force full page reload to clear all session data
    window.location.href = '/'
  }

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
              {isAdmin && (
                <Link href="/admin" className="text-sm font-medium hover:text-primary">
                  Admin
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            {isAuthenticated ? (
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="hidden md:inline-flex">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sign Out</span>
              </Button>
            ) : (
              <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
                <Link href="/sign-in">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Link>
              </Button>
            )}
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
                  {isAdmin && (
                    <Link href="/admin" className="text-sm font-medium hover:text-primary" onClick={() => setOpen(false)}>
                      Admin
                    </Link>
                  )}
                  <hr />
                  <Link href="/cart" className="text-sm font-medium hover:text-primary" onClick={() => setOpen(false)}>
                    Cart {cartItemCount > 0 && `(${cartItemCount})`}
                  </Link>
                  {isAuthenticated ? (
                    <Button variant="ghost" className="justify-start p-0 h-auto" onClick={() => {
                      handleSignOut();
                      setOpen(false);
                    }}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  ) : (
                    <Link href="/sign-in" className="text-sm font-medium hover:text-primary" onClick={() => setOpen(false)}>
                      Sign In
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}