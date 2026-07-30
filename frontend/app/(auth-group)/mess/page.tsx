import ProfileHeader from '@/components/common/profile-header';
import PageWrapper from '@/components/common/page-wrapper';
import { auth } from '@/config/auth';
import { getValidWorkspaceMember } from '@/lib/workspace-requests';
import { MessPageContents } from '@/components/mess/mess-page-contents';

const validTabs = [
  'overview',
  'meal-chart',
  'members',
  'profile',
  'notifications',
  'security',
] as const;

type MessPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function MessPage({ searchParams }: MessPageProps) {
  const session = await auth();
  const user = session?.user;
  const member = await getValidWorkspaceMember();
  const userData = { user, workspace: member?.workspace };
  const { tab } = await searchParams;
  const requestedTab = validTabs.find((item) => item === tab);

  return (
    <div className="bg-secondary-bg/70 dark:bg-primary-bg min-h-screen">
      <ProfileHeader userData={userData} />
      <PageWrapper className="tablet:px-6 tablet:py-8 px-4 py-6">
        <MessPageContents userData={userData} initialTab={requestedTab} />
      </PageWrapper>
    </div>
  );
}
