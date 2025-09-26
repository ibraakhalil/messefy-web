import { auth } from '@/auth'
import AppHeader from '@/components/common/app-header'
import { redirect } from 'next/navigation'

interface LayoutProps {
  children: React.ReactNode
  params: { subdomain: string }
}

export default async function layout({ children, params }: Readonly<LayoutProps>) {
  const session = await auth()
  if (!session?.user) return redirect('/auth/signin')

  return (
    <div className="min-h-screen font-[var(--font-comfortaa)]">
      <AppHeader subdomain={params.subdomain} session={session} />
      {children}
    </div>
  )
}
