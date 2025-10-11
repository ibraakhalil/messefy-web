import DashboardLayout from '@/components/dashboard/dashboard-layout'

export default function layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout> {children} </DashboardLayout>
}
