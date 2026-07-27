import ProfileHeader from '@/components/common/profile-header';
import PageWrapper from '@/components/common/page-wrapper';
import MonthDetails from '@/components/mess/month-details';
import { auth } from '@/config/auth';
import { getValidWorkspaceMember } from '@/lib/workspace-requests';

type MonthDetailsPageProps = {
  params: Promise<{ monthId: string }>;
};

export default async function MonthDetailsPage({ params }: MonthDetailsPageProps) {
  const [{ monthId }, session, member] = await Promise.all([
    params,
    auth(),
    getValidWorkspaceMember(),
  ]);
  const userData = {
    user: session?.user,
    workspace: member?.workspace,
  };

  return (
    <div className="bg-secondary-bg/70 dark:bg-primary-bg min-h-screen">
      <ProfileHeader userData={userData} />
      <PageWrapper className="tablet:px-6 tablet:py-8 px-4 py-6">
        <MonthDetails monthId={monthId} />
      </PageWrapper>
    </div>
  );
}
