import { LoginForm } from '@/components/auth/login-form'
import baseMetadata from '@/lib/metadata'
import { Metadata } from 'next'

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'Sign Up',
  description: 'Create an IndexFast account to start indexing your sites.',
}

export default function SignupPage() {
  return <LoginForm initialMode="signup" />
}
