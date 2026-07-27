import ProfileHeader from '@/components/common/profile-header';
import PageWrapper from '@/components/common/page-wrapper';
import { auth } from '@/config/auth';
import { getValidWorkspaceMember } from '@/lib/workspace-requests';
import { MessPageContents } from '@/components/mess/mess-page-contents';

export default async function MessPage() {
  const session = await auth();
  const user = session?.user;
  const member = await getValidWorkspaceMember();
  const userData = { user, workspace: member?.workspace };

  return (
    <PageWrapper>
      <ProfileHeader userData={userData} />
      <MessPageContents userData={userData} />
    </PageWrapper>
  );
}
