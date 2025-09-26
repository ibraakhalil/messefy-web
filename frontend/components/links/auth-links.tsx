import Link from 'next/link'
import { ComponentProps } from 'react'

type LinkProps = Omit<ComponentProps<typeof Link>, 'href'>

export function SignUpLink({ children, ...props }: LinkProps) {
  return (
    <Link href="/auth/sign-up" {...props}>
      {children}
    </Link>
  )
}

export function SignInLink({ children, ...props }: LinkProps) {
  return (
    <Link href="/auth/sign-in" {...props}>
      {children}
    </Link>
  )
}
