"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthRequiredPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/'

  const handleSignIn = () => {
    router.push(`/sign-in?returnTo=${encodeURIComponent(returnTo)}`)
  }

  const handleSignUp = () => {
    router.push(`/sign-up?returnTo=${encodeURIComponent(returnTo)}`)
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            You need to sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Please sign in to your account or create a new one to access this feature.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleSignUp}>
            Create Account
          </Button>
          <Button onClick={handleSignIn}>
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}