import AppHeader from '@/components/common/app-header'

export default function layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { subdomain: string }
}) {
  return (
    <div className="min-h-screen">
      <AppHeader subdomain={params.subdomain} />
      {children}
    </div>
  )
}
