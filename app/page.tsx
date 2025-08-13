import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Package, Shield, Truck } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Home - NextShop',
  description: 'Welcome to NextShop - Your one-stop online shopping destination',
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Welcome to NextShop
            </h1>
            <p className="mt-6 text-lg">
              Discover amazing products at unbeatable prices. Fast delivery, secure checkout, and exceptional customer service.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/category/all">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/sign-up">
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose NextShop</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Truck className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Fast Delivery</CardTitle>
              <CardDescription>
                Get your orders delivered quickly with our express shipping options
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Secure Checkout</CardTitle>
              <CardDescription>
                Shop with confidence using our secure payment processing
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Package className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Quality Products</CardTitle>
              <CardDescription>
                Carefully curated selection of high-quality products
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Electronics</h3>
              <p className="text-muted-foreground">Latest gadgets and devices</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Apparel</h3>
              <p className="text-muted-foreground">Fashion for everyone</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Home & Living</h3>
              <p className="text-muted-foreground">Everything for your home</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of satisfied customers
          </p>
          <Button size="lg" asChild>
            <Link href="/sign-up">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}