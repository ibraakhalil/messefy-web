import ProfileHeader from '@/components/common/profile-header';
import MessOverview from '@/components/mess/mess-overview';
import PageWrapper from '@/components/common/page-wrapper';
import { Links } from '@/components/links';
import Button from '@/components/ui/button';
import { auth } from '@/config/auth';
import { getValidWorkspaceMember } from '@/lib/workspace-requests';
import { cn } from '@/utils/cn';
import { redirect } from 'next/navigation';

export default async function MessPage() {
  const session = await auth();
  const user = session?.user;
  const member = await getValidWorkspaceMember();
  const userData = { user, workspace: member?.workspace };
  if (!userData.workspace) redirect('/profile');

  return (
    <PageWrapper>
      <ProfileHeader userData={userData} />

      <header className="my-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="tablet:flex-row tablet:items-center tablet:justify-between tablet:space-y-0 flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-2xl text-white">
              {userData.workspace?.name?.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-medium text-gray-900">
                  {userData.workspace?.name || 'Mess'}
                </h1>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    userData.workspace?.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800',
                  )}
                >
                  {userData.workspace?.isActive ? 'Open' : 'Closed'}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Current period totals, balances, deposits, and expenses are synced below.
              </p>
            </div>
          </div>

          {userData.workspace?.ownerId === userData.user?.id && (
            <Links.Dashboard>
              <Button>Dashboard</Button>
            </Links.Dashboard>
          )}
        </div>
      </header>

      <MessOverview />
    </PageWrapper>
  );
}
