'use client'

import { signIn } from 'next-auth/react'

export default function ResentTest() {
  const resendAction = (formData: FormData) => {
    const email = formData.get('email')?.toString() || ''
    signIn('resend', { email })
  }

  return (
    <form className="flex w-3xl flex-col bg-gray-100" action={resendAction}>
      <label htmlFor="email-resend">
        Email
        <input type="email" id="email-resend" name="email" />
      </label>
      <input type="submit" value="Signin with Resend" />
    </form>
  )
}
