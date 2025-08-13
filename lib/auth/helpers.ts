import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cache } from 'react'

export const getUser = cache(async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})

export const requireUser = cache(async () => {
  const user = await getUser()
  if (!user) {
    redirect('/auth/sign-in')
  }
  return user
})

export const requireAdmin = cache(async () => {
  const user = await requireUser()
  const supabase = createClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'admin') {
    redirect('/')
  }
  
  return user
})

export const getUserProfile = cache(async (userId: string) => {
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return profile
})