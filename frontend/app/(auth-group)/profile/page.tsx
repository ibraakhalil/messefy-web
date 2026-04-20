import { auth } from '@/config/auth';
import PageWrapper from '@/components/common/page-wrapper';
import { ProfileContents } from '@/components/profile/profile-contents';
import { getValidWorkspaceMember } from '@/lib/workspace-requests';
import ProfileHeader from '@/components/common/profile-header';
import ProfileHero from '@/components/profile/profile-hero';

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;
  const member = await getValidWorkspaceMember();
  const userData = { user, workspace: member?.workspace };

  return (
    <PageWrapper>
      <ProfileHeader userData={userData} />
      <ProfileHero
        fallbackUser={{ name: user?.name, email: user?.email, image: user?.image }}
        workspace={member?.workspace}
      />
      <ProfileContents userData={userData} />
    </PageWrapper>
  );
}
