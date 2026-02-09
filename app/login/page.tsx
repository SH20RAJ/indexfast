import { LoginForm } from '@/components/auth/login-form'
import baseMetadata from '@/lib/metadata'
import { Metadata } from 'next'
import { stackServerApp } from '@/stack/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'Login',
  description: 'Sign in to IndexFast to manage your sites and submissions.',
}

export default async function LoginPage() {
  const user = await stackServerApp.getUser()
  
  // Redirect to dashboard if already signed in
  if (user) {
    redirect('/dashboard')
  }

  return <LoginForm />
}
