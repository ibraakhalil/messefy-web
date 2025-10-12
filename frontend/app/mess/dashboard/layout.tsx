import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { getWorkspaceByUser } from '@/lib/workspace-requests';
import { redirect } from 'next/navigation';

export default async function layout({ children }: { children: React.ReactNode }) {
  const workspace = await getWorkspaceByUser();
  if (!workspace) redirect('/profile');

  return <DashboardLayout> {children} </DashboardLayout>;
}
