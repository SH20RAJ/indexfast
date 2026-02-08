import { LoginForm } from '@/components/auth/login-form'
import baseMetadata from '@/lib/metadata'
import { Metadata } from 'next'

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'Login',
  description: 'Sign in to IndexFast to manage your sites and submissions.',
}

export default function LoginPage() {
  return <LoginForm />
}
