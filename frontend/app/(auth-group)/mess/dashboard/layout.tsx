import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { getValidWorkspaceMember } from '@/lib/workspace-requests';
import { redirect } from 'next/navigation';

export default async function layout({ children }: { children: React.ReactNode }) {
  const member = await getValidWorkspaceMember();
  if (!member || !['owner', 'manager'].includes(member.role)) redirect('/mess');

  return (
    <div className="[--container-width:1320px]">
      <DashboardLayout> {children} </DashboardLayout>
    </div>
  );
}
