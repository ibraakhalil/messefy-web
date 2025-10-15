import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { getValidWorkspaceMember } from '@/lib/workspace-requests';
import { WorkspaceProvider } from '@/providers/workspace-provider';
import { redirect } from 'next/navigation';

export default async function layout({ children }: { children: React.ReactNode }) {
  const member = await getValidWorkspaceMember();
  if (!member || member.role !== 'owner') redirect('/profile');

  return (
    <WorkspaceProvider workspace={member.workspace}>
      <DashboardLayout> {children} </DashboardLayout>
    </WorkspaceProvider>
  );
}
